"""
밥토리 백엔드 API (브랜치 3-2 버전)
날씨 + 맛집 검색 API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 로컬 모듈
from database import engine, Base
from weather_service import fetch_weather
from kakao_service import search_places

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(
    title="밥토리 API",
    description="날씨 기반 음식 추천 및 캐릭터 육성 시스템",
    version="0.3.2"
)

# CORS 설정
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# 기본 엔드포인트
# ============================================

@app.get("/")
def read_root():
    """API 상태 확인"""
    return {
        "message": "밥토리 백엔드 연결 완료!",
        "version": "0.3.2",
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
# 서버 실행
# ============================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )