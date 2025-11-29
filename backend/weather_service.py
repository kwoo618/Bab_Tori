"""
날씨 API 서비스
OpenWeatherMap API 연동
"""

import httpx
import os
from dotenv import load_dotenv

load_dotenv()

OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")


async def fetch_weather(lat: float, lon: float):
    """
    OpenWeatherMap API로 날씨 정보 가져오기
    
    Args:
        lat: 위도
        lon: 경도
    
    Returns:
        dict: 날씨 정보
    """
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHERMAP_API_KEY,
        "units": "metric",  # 섭씨
        "lang": "kr"  # 한국어
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            return {
                "location": data.get("name", "Unknown"),
                "temperature": data["main"]["temp"],
                "condition": data["weather"][0]["main"],  # Clear, Rain, Snow 등
                "description": data["weather"][0]["description"],
                "humidity": data["main"]["humidity"],
                "feels_like": data["main"]["feels_like"],
                "is_mock": False
            }
    
    except Exception as e:
        print(f"날씨 API 오류: {e}")
        # 에러 시 기본값 반환
        return {
            "location": "Unknown",
            "temperature": 20.0,
            "condition": "Clear",
            "description": "맑음",
            "humidity": 50,
            "feels_like": 20.0,
            "error": str(e),
            "is_mock": True
        }


# ============================================
# 테스트 코드
# ============================================

if __name__ == "__main__":
    import asyncio
    
    async def test():
        print("=" * 50)
        print("날씨 API 테스트")
        print("=" * 50)
        print()
        
        # 대구 좌표
        lat, lon = 35.8714, 128.6014
        
        print("날씨 정보 조회 중...")
        weather = await fetch_weather(lat, lon)
        
        print()
        print(f"📍 위치: {weather['location']}")
        print(f"🌡️  온도: {weather['temperature']}°C")
        print(f"☁️  날씨: {weather['condition']} ({weather['description']})")
        print(f"💧 습도: {weather['humidity']}%")
        print(f"🌡️  체감온도: {weather['feels_like']}°C")
        print(f"🔧 Mock 데이터: {weather.get('is_mock', False)}")
        print()
        
        print("=" * 50)
        print("테스트 완료! ✅")
        print("=" * 50)
    
    asyncio.run(test())
