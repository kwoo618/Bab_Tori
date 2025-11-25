"""
맛집 검색 API 서비스
Kakao Map API 연동
"""

import httpx
import os
from dotenv import load_dotenv

load_dotenv()

KAKAO_MAP_API_KEY = os.getenv("KAKAO_MAP_API_KEY")


async def search_places(keyword: str, lat: float, lon: float, radius: int = 1000):
    """
    카카오맵 API로 맛집 검색
    
    Args:
        keyword: 검색 키워드 (예: "김치찌개")
        lat: 위도
        lon: 경도
        radius: 검색 반경 (미터, 기본 1km)
    
    Returns:
        list: 맛집 정보 리스트
    """
    # API 키가 없으면 Mock 데이터 반환
    if not KAKAO_MAP_API_KEY or KAKAO_MAP_API_KEY == "your_kakao_map_api_key_here":
        return [
            {
                "name": f"{keyword} 맛집 1 (Mock)",
                "category": "한식",
                "address": "대구광역시 중구",
                "road_address": "대구광역시 중구 xx로 123",
                "latitude": lat + 0.001,
                "longitude": lon + 0.001,
                "distance": 100,
                "phone": "053-XXX-XXXX",
                "place_url": "https://place.map.kakao.com/",
                "is_mock": True
            },
            {
                "name": f"{keyword} 맛집 2 (Mock)",
                "category": "한식",
                "address": "대구광역시 중구",
                "road_address": "대구광역시 중구 yy로 456",
                "latitude": lat - 0.001,
                "longitude": lon - 0.001,
                "distance": 150,
                "phone": "053-YYY-YYYY",
                "place_url": "https://place.map.kakao.com/",
                "is_mock": True
            },
            {
                "name": f"{keyword} 맛집 3 (Mock)",
                "category": "한식",
                "address": "대구광역시 중구",
                "road_address": "대구광역시 중구 zz로 789",
                "latitude": lat + 0.002,
                "longitude": lon,
                "distance": 200,
                "phone": "053-ZZZ-ZZZZ",
                "place_url": "https://place.map.kakao.com/",
                "is_mock": True
            }
        ]
    
    url = "https://dapi.kakao.com/v2/local/search/keyword.json"
    headers = {
        "Authorization": f"KakaoAK {KAKAO_MAP_API_KEY}"
    }
    params = {
        "query": keyword,
        "x": lon,
        "y": lat,
        "radius": radius,
        "category_group_code": "FD6"  # 음식점 카테고리
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            places = []
            for place in data.get("documents", [])[:5]:  # 최대 5개
                places.append({
                    "name": place.get("place_name"),
                    "category": place.get("category_name"),
                    "address": place.get("address_name"),
                    "road_address": place.get("road_address_name"),
                    "latitude": float(place.get("y")),
                    "longitude": float(place.get("x")),
                    "distance": int(place.get("distance", 0)),
                    "phone": place.get("phone", ""),
                    "place_url": place.get("place_url", ""),
                    "is_mock": False
                })
            
            return places
    
    except Exception as e:
        print(f"카카오맵 API 오류: {e}")
        return []


# ============================================
# 테스트 코드
# ============================================

if __name__ == "__main__":
    import asyncio
    
    async def test():
        print("=" * 50)
        print("맛집 검색 API 테스트")
        print("=" * 50)
        print()
        
        # 대구 좌표
        lat, lon = 35.8714, 128.6014
        
        print("'김치찌개' 맛집 검색 중...")
        places = await search_places("김치찌개", lat, lon, radius=1000)
        
        print()
        print(f"📍 검색 결과: {len(places)}개")
        print()
        
        for i, place in enumerate(places, 1):
            print(f"{i}. {place['name']}")
            print(f"   주소: {place['address']}")
            print(f"   거리: {place['distance']}m")
            print(f"   전화: {place['phone']}")
            print(f"   Mock 데이터: {place.get('is_mock', False)}")
            print()
        
        print("=" * 50)
        print("테스트 완료! ✅")
        print("=" * 50)
    
    asyncio.run(test())
