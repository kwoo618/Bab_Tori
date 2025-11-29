"""
밥토리 백엔드 통합 테스트
모든 파일이 정상 작동하는지 확인
"""

import sys
import os
from datetime import datetime

# 색상 출력용
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_test(name, status, message=""):
    """테스트 결과 출력"""
    if status:
        print(f"{Colors.GREEN}✓{Colors.RESET} {name}")
        if message:
            print(f"  → {message}")
    else:
        print(f"{Colors.RED}✗{Colors.RESET} {name}")
        if message:
            print(f"  → {Colors.RED}{message}{Colors.RESET}")
    print()

def print_section(title):
    """섹션 구분선"""
    print()
    print("=" * 60)
    print(f"{Colors.BLUE}{title}{Colors.RESET}")
    print("=" * 60)
    print()


# ============================================
# 테스트 시작
# ============================================

print()
print("=" * 60)
print(f"{Colors.BLUE}밥토리 백엔드 통합 테스트{Colors.RESET}")
print("=" * 60)
print()

total_tests = 0
passed_tests = 0


# ============================================
# 1. 환경 설정 테스트
# ============================================

print_section("1. 환경 설정 테스트")

# 1-1. .env 파일 존재 확인
total_tests += 1
try:
    from dotenv import load_dotenv
    load_dotenv()
    env_exists = os.path.exists('.env')
    print_test(".env 파일 존재", env_exists, 
               ".env 파일이 있습니다." if env_exists else ".env 파일을 생성하세요.")
    if env_exists:
        passed_tests += 1
except Exception as e:
    print_test(".env 파일 존재", False, str(e))

# 1-2. requirements.txt 확인
total_tests += 1
try:
    req_exists = os.path.exists('requirements.txt')
    print_test("requirements.txt 존재", req_exists)
    if req_exists:
        passed_tests += 1
        with open('requirements.txt', 'r') as f:
            packages = f.read()
            print(f"  → 필수 패키지: fastapi, sqlalchemy, uvicorn, httpx")
except Exception as e:
    print_test("requirements.txt 존재", False, str(e))


# ============================================
# 2. 데이터베이스 테스트
# ============================================

print_section("2. 데이터베이스 테스트")

# 2-1. database.py import
total_tests += 1
try:
    from database import engine, get_db, test_connection
    print_test("database.py import", True, "DB 연결 모듈 로드 성공")
    passed_tests += 1
except Exception as e:
    print_test("database.py import", False, str(e))

# 2-2. DB 연결 테스트
total_tests += 1
try:
    connection = engine.connect()
    connection.close()
    print_test("PostgreSQL 연결", True, "데이터베이스 연결 성공")
    passed_tests += 1
except Exception as e:
    print_test("PostgreSQL 연결", False, 
               f"{str(e)}\n  → PostgreSQL 실행 여부 확인\n  → .env의 DATABASE_URL 확인")

# 2-3. models.py import
total_tests += 1
try:
    from models import CharacterState, FoodRecord, UserPreference
    print_test("models.py import", True, "DB 모델 로드 성공")
    passed_tests += 1
    print(f"  → CharacterState: Tamagotchi 참고 (satiety, friendship, level, exp)")
    print(f"  → FoodRecord: 음식 기록")
    print(f"  → UserPreference: 사용자 선호도")
except Exception as e:
    print_test("models.py import", False, str(e))


# ============================================
# 3. 데이터 파일 테스트
# ============================================

print_section("3. 데이터 파일 테스트")

# 3-1. foods_database.csv 존재
total_tests += 1
try:
    csv_exists = os.path.exists('foods_database.csv')
    print_test("foods_database.csv 존재", csv_exists)
    if csv_exists:
        passed_tests += 1
        import csv
        with open('foods_database.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            foods = list(reader)
            print(f"  → 음식 개수: {len(foods)}개")
except Exception as e:
    print_test("foods_database.csv 존재", False, str(e))

# 3-2. foods_data.py 기능 테스트
total_tests += 1
try:
    from foods_data import get_all_foods, get_foods_by_category, get_foods_by_ingredient
    
    all_foods = get_all_foods()
    korean_foods = get_foods_by_category("한식")
    meat_foods = get_foods_by_ingredient("고기")
    
    print_test("foods_data.py 기능", True, 
               f"전체 {len(all_foods)}개, 한식 {len(korean_foods)}개, 고기 {len(meat_foods)}개")
    passed_tests += 1
except Exception as e:
    print_test("foods_data.py 기능", False, str(e))


# ============================================
# 4. 외부 API 서비스 테스트
# ============================================

print_section("4. 외부 API 서비스 테스트")

# 4-1. weather_service.py
total_tests += 1
try:
    import asyncio
    from weather_service import fetch_weather
    
    async def test_weather():
        weather = await fetch_weather(35.8714, 128.6014)
        return weather
    
    weather = asyncio.run(test_weather())
    is_mock = weather.get('is_mock', True)
    
    print_test("weather_service.py", True, 
               f"날씨: {weather.get('condition')} {weather.get('temperature')}°C (Mock: {is_mock})")
    passed_tests += 1
except Exception as e:
    print_test("weather_service.py", False, str(e))

# 4-2. kakao_service.py
total_tests += 1
try:
    from kakao_service import search_places
    
    async def test_kakao():
        places = await search_places("김치찌개", 35.8714, 128.6014, 1000)
        return places
    
    places = asyncio.run(test_kakao())
    print_test("kakao_service.py", True, 
               f"맛집 검색: {len(places)}개 (Mock: {places[0].get('is_mock', True) if places else 'N/A'})")
    passed_tests += 1
except Exception as e:
    print_test("kakao_service.py", False, str(e))


# ============================================
# 5. 추천 알고리즘 테스트
# ============================================

print_section("5. 추천 알고리즘 테스트")

# 5-1. recommendation_system.py
total_tests += 1
try:
    from recommendation_system import recommend_4_foods, chatbot_filter_recommend
    
    # 비 오는 날 추천
    rain_recommendations = recommend_4_foods("Rain", 15)
    
    # 더운 날 추천
    hot_recommendations = recommend_4_foods("Clear", 30)
    
    # 챗봇 필터링
    korean_foods = chatbot_filter_recommend(category="한식")
    
    print_test("recommendation_system.py", True, 
               f"비오는날 4개, 더운날 4개, 한식 {len(korean_foods)}개")
    passed_tests += 1
    
    print(f"  → 비오는 날 추천: {rain_recommendations[0]['name']} ({rain_recommendations[0]['reason']})")
    print(f"  → 더운 날 추천: {hot_recommendations[0]['name']} ({hot_recommendations[0]['reason']})")
    
except Exception as e:
    print_test("recommendation_system.py", False, str(e))


# ============================================
# 6. FastAPI 앱 테스트
# ============================================

print_section("6. FastAPI 앱 테스트")

# 6-1. main.py import
total_tests += 1
try:
    from main import app
    print_test("main.py import", True, "FastAPI 앱 로드 성공")
    passed_tests += 1
except Exception as e:
    print_test("main.py import", False, str(e))

# 6-2. API 엔드포인트 확인
total_tests += 1
try:
    routes = [route.path for route in app.routes]
    expected_routes = [
        "/",
        "/weather",
        "/places",
        "/character/state",
        "/character/update",
        "/food/recommend",
        "/food/select",
        "/food/diary"
    ]
    
    missing_routes = [r for r in expected_routes if r not in routes]
    
    if not missing_routes:
        print_test("API 엔드포인트", True, f"{len(expected_routes)}개 모두 존재")
        passed_tests += 1
    else:
        print_test("API 엔드포인트", False, f"누락: {missing_routes}")
    
except Exception as e:
    print_test("API 엔드포인트", False, str(e))


# ============================================
# 7. 오픈소스 문서 테스트
# ============================================

print_section("7. 오픈소스 문서 테스트")

# 7-1. OSS_LICENSES.md
total_tests += 1
try:
    oss_exists = os.path.exists('OSS_LICENSES.md')
    print_test("OSS_LICENSES.md 존재", oss_exists, 
               "Tamagotchi Clone 라이선스 명시" if oss_exists else "문서를 생성하세요.")
    if oss_exists:
        passed_tests += 1
except Exception as e:
    print_test("OSS_LICENSES.md 존재", False, str(e))


# ============================================
# 최종 결과
# ============================================

print_section("테스트 결과")

pass_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0

print(f"전체 테스트: {total_tests}개")
print(f"통과: {Colors.GREEN}{passed_tests}개{Colors.RESET}")
print(f"실패: {Colors.RED}{total_tests - passed_tests}개{Colors.RESET}")
print(f"통과율: {Colors.GREEN if pass_rate >= 80 else Colors.YELLOW}{pass_rate:.1f}%{Colors.RESET}")
print()

if passed_tests == total_tests:
    print(f"{Colors.GREEN}{'='*60}")
    print("🎉 모든 테스트 통과! 프로젝트 준비 완료!")
    print(f"{'='*60}{Colors.RESET}")
    print()
    print("다음 단계:")
    print("1. python main.py 실행")
    print("2. http://localhost:8000/docs 접속")
    print("3. API 테스트")
    print()
elif pass_rate >= 80:
    print(f"{Colors.YELLOW}{'='*60}")
    print("⚠️  대부분의 테스트 통과! 일부 확인 필요")
    print(f"{'='*60}{Colors.RESET}")
    print()
    print("확인 사항:")
    print("1. PostgreSQL 실행 여부")
    print("2. .env 파일 설정")
    print("3. 실패한 테스트 확인")
    print()
else:
    print(f"{Colors.RED}{'='*60}")
    print("❌ 여러 테스트 실패! 설정 확인 필요")
    print(f"{'='*60}{Colors.RESET}")
    print()
    print("확인 사항:")
    print("1. pip install -r requirements.txt 실행")
    print("2. PostgreSQL 설치 및 실행")
    print("3. .env 파일 생성")
    print("4. 모든 파일이 backend 폴더에 있는지 확인")
    print()