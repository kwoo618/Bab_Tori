"""
밥토리 백엔드 API
날씨 기반 음식 추천 및 캐릭터 육성 시스템
"""

from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
import uvicorn
import os
import shutil
from fastapi.staticfiles import StaticFiles

# 로컬 모듈
from database import engine, get_db, Base
from models import CharacterState, FoodRecord
from chatbot import with_message_history
from weather_service import fetch_weather
from kakao_service import search_places
from recommendation_system import recommend_4_foods

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(
    title="밥토리 API",
    description="날씨 기반 음식 추천 및 캐릭터 육성 시스템",
    version="1.0.0"
)

# CORS 설정
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# /uploads 경로로 정적 파일 제공
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ============================================
# 기본 엔드포인트
# ============================================

@app.get("/")
def read_root():
    """API 상태 확인"""
    return {
        "message": "밥토리 백엔드 연결 완료!",
        "version": "1.0.0",
        "features": [
            "날씨 API",
            "맛집 검색",
            "음식 추천",
            "캐릭터 육성"
        ],
        "docs": "/docs"
    }


# ============================================
# 날씨 API
# ============================================

@app.get("/weather")
async def get_weather(lat: float = 35.8714, lon: float = 128.6014):
    """
    날씨 정보 조회
    
    - **lat**: 위도 (기본값: 대구)
    - **lon**: 경도 (기본값: 대구)
    """
    weather_data = await fetch_weather(lat, lon)
    return weather_data


# ============================================
# 맛집 검색 API
# ============================================

@app.get("/places")
async def get_places(
    keyword: str = "맛집",
    lat: float = 35.8714,
    lon: float = 128.6014,
    radius: int = 1000
):
    """
    주변 맛집 검색
    
    - **keyword**: 검색 키워드
    - **lat**: 위도
    - **lon**: 경도
    - **radius**: 검색 반경 (미터)
    """
    places = await search_places(keyword, lat, lon, radius)
    return {
        "keyword": keyword,
        "count": len(places),
        "places": places
    }


# ============================================
# 캐릭터 상태 API
# ============================================

@app.get("/character/state")
def get_character_state(user_id: str = "default_user", db: Session = Depends(get_db)):
    """캐릭터 현재 상태 조회"""
    character = db.query(CharacterState).filter(CharacterState.user_id == user_id).first()
    
    if not character:
        # 캐릭터가 없으면 새로 생성
        character = CharacterState(user_id=user_id)
        db.add(character)
        db.commit()
        db.refresh(character)
    
    # 포만감 자동 감소 계산 (시간 경과)
    if character.last_update_time:
        now = datetime.now()
        last_update_time = character.last_update_time

        # ✅ 둘 다 tz정보를 제거해서 같은 타입으로 맞춰주기
        now_naive = now.replace(tzinfo=None)
        last_naive = last_update_time.replace(tzinfo=None)

        time_diff = now_naive - last_naive
        hours_passed = time_diff.total_seconds() / 3600
        
        # 1시간당 10% 감소
        satiety_decrease = int(hours_passed * 10)
        character.satiety = max(0, character.satiety - satiety_decrease)
        character.last_update_time = now
        db.commit()
    
    return character.to_dict()

@app.post("/character/update")
def update_character_state(
    satiety: Optional[int] = None,
    friendship: Optional[int] = None,
    exp_gain: int = 0,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    """캐릭터 상태 업데이트"""
    character = db.query(CharacterState).filter(CharacterState.user_id == user_id).first()
    
    if not character:
        raise HTTPException(status_code=404, detail="캐릭터를 찾을 수 없습니다.")
    
    # 상태 업데이트
    if satiety is not None:
        character.satiety = max(0, min(100, satiety))
    if friendship is not None:
        character.friendship = max(0, min(100, friendship))
    
    # 경험치 및 레벨업
    level_up = False
    if exp_gain > 0:
        character.exp += exp_gain
        
        # 레벨업 체크 (레벨 * 100 경험치 필요)
        while character.exp >= character.level * 100:
            character.exp -= character.level * 100
            character.level += 1
            level_up = True
    
    db.commit()
    db.refresh(character)
    
    return {
        "message": "캐릭터 상태가 업데이트되었습니다.",
        "character": character.to_dict(),
        "level_up": level_up
    }


# ============================================
# 음식 추천 API
# ============================================

@app.get("/food/recommend")
async def recommend_food(
    lat: float = 35.8714,
    lon: float = 128.6014,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    """
    날씨 기반 음식 4개 추천
    
    - 날씨 기반 (재료) 1개
    - 날씨 기반 (카테고리) 1개
    - 랜덤 2개
    """
    # 1. 날씨 정보
    weather = await fetch_weather(lat, lon)
    
    # 2. 캐릭터 상태
    character = db.query(CharacterState).filter(CharacterState.user_id == user_id).first()
    
    if not character:
        character = CharacterState(user_id=user_id)
        db.add(character)
        db.commit()
        db.refresh(character)
    
    # 3. 음식 추천 (4개)
    recommendations = recommend_4_foods(
        weather["condition"],
        weather["temperature"]
    )
    
    return {
        "weather": weather,
        "character": {
            "level": character.level,
            "satiety": character.satiety,
            "friendship": character.friendship
        },
        "recommendations": recommendations
    }


# ============================================
# 음식 선택 API
# ============================================

@app.post("/food/select")
async def select_food(
    food_name: str,
    is_recommended: bool = True,
    photo: Optional[UploadFile] = File(None),
    user_id: str = "default_user",
    lat: float = 35.8714,
    lon: float = 128.6014,
    db: Session = Depends(get_db)
):
    """
    음식 선택 및 사진 업로드
    
    - 밥토리 추천 음식: 친밀도 +20%, 경험치 +50
    - 다른 음식: 친밀도 +5%, 경험치 +10
    - 포만감은 동일하게 +40%
    """
    # 캐릭터 가져오기
    character = db.query(CharacterState).filter(CharacterState.user_id == user_id).first()
    
    if not character:
        character = CharacterState(user_id=user_id)
        db.add(character)
        db.commit()
        db.refresh(character)
    
    # 보상 계산
    satiety_gain = 40
    friendship_gain = 20 if is_recommended else 5
    exp_gain = 50 if is_recommended else 10
    
    # 캐릭터 상태 업데이트
    character.satiety = min(100, character.satiety + satiety_gain)
    character.friendship = min(100, character.friendship + friendship_gain)
    character.exp += exp_gain
    character.last_meal_time = datetime.now()
    character.last_update_time = datetime.now()
    
    # 레벨업 체크
    level_up = False
    while character.exp >= character.level * 100:
        character.exp -= character.level * 100
        character.level += 1
        level_up = True
    
    # 날씨 정보 가져오기
    weather = await fetch_weather(lat, lon)
    
    # 사진 처리 (선택사항)
    photo_url = None
    if photo:
        # 파일 이름 만들어서 저장
        # (충돌 방지용으로 시간 + 원본 파일명 섞어줌)
        filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{photo.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)

        # 클라이언트에서 접근할 때 쓸 경로 (앞에서 StaticFiles로 마운트한 경로)
        photo_url = f"/uploads/{filename}"
    
    # 음식 기록 저장
    food_record = FoodRecord(
        user_id=user_id,
        food_name=food_name,
        is_recommended=is_recommended,
        satiety_gain=satiety_gain,
        friendship_gain=friendship_gain,
        exp_gain=exp_gain,
        photo_url=photo_url,
        weather_condition=weather["condition"],
        temperature=weather["temperature"]
    )
    
    db.add(food_record)
    db.commit()
    db.refresh(character)
    
    # 캐릭터 반응
    if is_recommended:
        character_emoji = "🥰"
        character_message = f"{food_name} 맛있었어! 고마워!"
    else:
        character_emoji = "😐"
        character_message = f"음... {food_name}도 괜찮네!"
    
    return {
        "message": character_message,
        "character_emoji": character_emoji,
        "rewards": {
            "satiety_gain": satiety_gain,
            "friendship_gain": friendship_gain,
            "exp_gain": exp_gain
        },
        "character": character.to_dict(),
        "level_up": level_up
    }


# ============================================
# 챗봇 API
# ============================================

class ChatRequest(BaseModel):
    """챗봇 요청 모델"""
    session_id: str
    message: str

@app.post("/chat")
async def chat_with_bot(request: ChatRequest):
    """
    밥토리 AI 챗봇과 대화
    
    - **session_id**: 사용자별 대화 기록을 유지하기 위한 고유 ID
    - **message**: 사용자가 보낸 메시지
    """
    try:
        async def stream_generator():
            """스트리밍 응답을 생성하는 제너레이터"""
            config = {"configurable": {"session_id": request.session_id}}
            
            # 챗봇 체인을 스트림 방식으로 호출
            async for chunk in with_message_history.astream(
                {"message": request.message},
                config=config
            ):
                yield chunk.content

        return StreamingResponse(stream_generator(), media_type="text/plain")
    except Exception as e:
        print(f"챗봇 API 오류: {e}")
        raise HTTPException(status_code=500, detail="챗봇 응답 중 오류가 발생했습니다.")


# ============================================
# 음식 일기 (도감) API
# ============================================

@app.get("/food/diary")
def get_food_diary(user_id: str = "default_user", db: Session = Depends(get_db)):
    """음식 일기 조회 (먹었던 음식 기록)"""
    records = db.query(FoodRecord)\
        .filter(FoodRecord.user_id == user_id)\
        .order_by(FoodRecord.created_at.desc())\
        .all()
    
    return {
        "user_id": user_id,
        "total_count": len(records),
        "records": [record.to_dict() for record in records]
    }


# ============================================
# 서버 실행
# ============================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
