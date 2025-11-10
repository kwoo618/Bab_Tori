"""
밥토리 백엔드 API (브랜치 4 버전)
날씨, 맛집, 음식 추천 API
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn

# 로컬 모듈
from database import engine, get_db, Base
from models import CharacterState
from weather_service import fetch_weather
from kakao_service import search_places
from recommendation_system import recommend_4_foods

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(
    title="밥토리 API",
    description="날씨 기반 음식 추천 및 캐릭터 육성 시스템",
    version="0.4.0"
)

# CORS 설정
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
]

# ============================================
# 기본 엔드포인트
# ============================================

@app.get("/")
def read_root():
    """API 상태 확인"""
    return {
        "message": "밥토리 백엔드 연결 완료!",
        "version": "0.4.0",
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
# 음식 추천 API (핵심)
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
    # 1. 날씨 정보 가져오기
    weather = await fetch_weather(lat, lon)
    
    # 2. 캐릭터 상태 가져오기
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
# 서버 실행
# ============================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
