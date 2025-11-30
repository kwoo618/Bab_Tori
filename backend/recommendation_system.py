"""
음식 추천 시스템
- 4가지 추천 방식 (날씨 2개 + 랜덤 2개)
- 챗봇 필터링 추천 (카테고리 + 재료)
"""

import random
from datetime import datetime
from sqlalchemy.orm import Session
from models import Food


# ============================================
# 4가지 음식 추천 시스템
# ============================================

def recommend_4_foods(db: Session, weather_condition: str, temperature: float):
    """
    날씨 기반 + 랜덤으로 총 4개 음식 추천
    (데이터베이스 사용 버전)
    
    Args:
        db: SQLAlchemy 세션 객체
        weather_condition: 날씨 상태 (Rain, Snow, Clear 등)
        temperature: 온도 (섭씨)
    
    Returns:
        list: 추천 음식 4개 (dict 리스트)
    """
    recommendations = []
    
    # ===== 추천 1: 날씨 기반 - 재료 우선 =====
    if weather_condition in ["Rain", "Drizzle", "Thunderstorm"]:
        # 비 오는 날 → 국물 요리
        ingredient = "국물"
        reason = "비 오는 날엔 따뜻한 국물이 최고!"
    elif weather_condition == "Snow":
        # 눈 오는 날 → 국물 요리
        ingredient = "국물"
        reason = "눈 오는 날엔 뜨끈한 국물!"
    elif temperature > 28:
        # 더운 날 → 면 요리 (시원한)
        ingredient = "면"
        reason = "더울 땐 시원한 면 요리!"
    elif temperature < 10:
        # 추운 날 → 국물 요리
        ingredient = "국물"
        reason = "추울 땐 따뜻한 국물!"
    else:
        # 보통 날씨 → 밥
        ingredient = "밥"
        reason = "든든하게 밥 먹자!"
    
    ingredient_foods = db.query(Food).filter(Food.ingredients.contains(ingredient)).all()
    if ingredient_foods:
        food1 = random.choice(ingredient_foods)
        recommendations.append({
            "name": food1.name,
            "category": food1.category,
            "ingredients": food1.ingredients,
            "image_url": food1.image_url,
            "reason": reason,
            "type": "weather_ingredient"
        })
    
    # ===== 추천 2: 날씨 기반 - 카테고리 우선 =====
    if weather_condition in ["Rain", "Drizzle", "Thunderstorm", "Snow"]:
        # 비/눈 오는 날 → 한식 (국물 요리가 많음)
        category = "한식"
        reason = "날씨가 안 좋을 땐 역시 한식!"
    elif temperature > 28:
        # 더운 날 → 일식 (차가운 메뉴가 많음)
        category = "일식"
        reason = "더울 땐 깔끔한 일식!"
    elif temperature < 10:
        # 추운 날 → 중식 (기름진 음식)
        category = "중식"
        reason = "추울 땐 든든한 중식!"
    else:
        # 보통 날씨 → 양식
        category = "양식"
        reason = "오늘은 양식 어때?"
    
    category_foods = db.query(Food).filter(Food.category == category).all()
    if category_foods:
        # 추천 1과 중복 방지
        already_recommended_names = [r['name'] for r in recommendations]
        available = [f for f in category_foods if f.name not in already_recommended_names]
        if available:
            food2 = random.choice(available)
            recommendations.append({
                "name": food2.name,
                "category": food2.category,
                "ingredients": food2.ingredients,
                "image_url": food2.image_url,
                "reason": reason,
                "type": "weather_category"
            })
    
    # ===== 추천 3-4: 완전 랜덤 =====
    # 이미 추천된 음식 제외
    already_recommended_names = [r["name"] for r in recommendations]
    
    query = db.query(Food)
    if already_recommended_names:
        query = query.filter(Food.name.notin_(already_recommended_names))
    available_foods = query.all()
    
    # 추천할 랜덤 음식 개수
    num_to_recommend = min(len(available_foods), 4 - len(recommendations))

    if num_to_recommend > 0:
        random_foods = random.sample(available_foods, num_to_recommend)
        for food in random_foods:
            recommendations.append({
                "name": food.name,
                "category": food.category,
                "ingredients": food.ingredients,
                "image_url": food.image_url,
                "reason": "이것도 맛있을 것 같아!",
                "type": "random"
            })
    
    return recommendations


# ============================================
# 챗봇 추천 시스템 (카테고리 + 재료 필터)
# ============================================

def chatbot_filter_recommend(db: Session, category: str = None, ingredients: list = None, limit: int = 3):
    """
    카테고리와 재료로 필터링하여 추천 (DB 사용)
    
    Args:
        db: SQLAlchemy 세션 객체
        category: 선택한 카테고리 (한식, 중식, 일식, 양식, 패스트푸드, 분식, 찜/탕)
        ingredients: 선택한 재료 리스트 (["고기", "밥"])
        limit: 추천할 음식 개수 (기본 3개)
    
    Returns:
        list: 추천 음식 리스트
    """
    query = db.query(Food)
    
    # 1단계: 카테고리 필터
    if category:
        query = query.filter(Food.category == category)
    
    # 2단계: 재료 필터 (선택한 재료가 모두 포함된 음식)
    if ingredients:
        for ing in ingredients:
            query = query.filter(Food.ingredients.contains(ing))
    
    filtered_foods = query.all()
    
    # 추천
    if len(filtered_foods) >= limit:
        return random.sample(filtered_foods, limit)
    else:
        return filtered_foods


# ============================================
# 테스트 코드 (현재 파일 직접 실행 시 사용 안 함)
# ============================================

if __name__ == "__main__":
    # 이 파일은 직접 실행되지 않고 main.py에서 임포트하여 사용됩니다.
    # 테스트를 원할 경우, 데이터베이스 세션을 생성하여 함수에 전달해야 합니다.
    print("이 파일은 직접 실행하여 테스트할 수 없습니다.")
    print("main.py를 통해 API를 호출하여 테스트해주세요.")
