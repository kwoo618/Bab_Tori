"""
음식 추천 시스템
- 4가지 추천 방식 (날씨 2개 + 랜덤 2개)
- 챗봇 필터링 추천 (카테고리 + 재료)
"""

import random
from datetime import datetime
from foods_data import FOOD_DATABASE, get_foods_by_category, get_foods_by_ingredient


# ============================================
# 4가지 음식 추천 시스템
# ============================================

def recommend_4_foods(weather_condition: str, temperature: float):
    """
    날씨 기반 + 랜덤으로 총 4개 음식 추천
    
    Args:
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
    
    ingredient_foods = get_foods_by_ingredient(ingredient)
    if ingredient_foods:
        food1 = random.choice(ingredient_foods)
        recommendations.append({
            "name": food1["name"],
            "category": food1["category"],
            "ingredients": food1["ingredients"],
            "reason": reason,
            "type": "weather_ingredient"
        })
    
    # ===== 추천 2: 날씨 기반 - 카테고리 우선 =====
    if weather_condition in ["Rain", "Drizzle", "Thunderstorm", "Snow"]:
        # 비/눈 오는 날 → 찜/탕
        category = "찜/탕"
        reason = "날씨가 안 좋을 땐 따뜻한 찜/탕!"
    elif temperature > 28:
        # 더운 날 → 양식 (가벼운)
        category = "양식"
        reason = "더울 땐 시원한 양식!"
    elif temperature < 10:
        # 추운 날 → 한식
        category = "한식"
        reason = "추울 땐 따뜻한 한식!"
    else:
        # 보통 날씨 → 중식
        category = "중식"
        reason = "든든한 중식 어때?"
    
    category_foods = get_foods_by_category(category)
    if category_foods:
        # 추천 1과 중복 방지
        available = [f for f in category_foods if f["name"] != recommendations[0]["name"]]
        if available:
            food2 = random.choice(available)
            recommendations.append({
                "name": food2["name"],
                "category": food2["category"],
                "ingredients": food2["ingredients"],
                "reason": reason,
                "type": "weather_category"
            })
    
    # ===== 추천 3-4: 완전 랜덤 =====
    # 이미 추천된 음식 제외
    already_recommended = [r["name"] for r in recommendations]
    available_foods = [f for f in FOOD_DATABASE if f["name"] not in already_recommended]
    
    if len(available_foods) >= 2:
        random_foods = random.sample(available_foods, 2)
        for food in random_foods:
            recommendations.append({
                "name": food["name"],
                "category": food["category"],
                "ingredients": food["ingredients"],
                "reason": "이것도 맛있을 것 같아!",
                "type": "random"
            })
    
    return recommendations


# ============================================
# 챗봇 추천 시스템 (카테고리 + 재료 필터)
# ============================================

def chatbot_filter_recommend(category: str = None, ingredients: list = None, limit: int = 3):
    """
    카테고리와 재료로 필터링하여 추천
    
    Args:
        category: 선택한 카테고리 (한식, 중식, 일식, 양식, 패스트푸드, 분식, 찜/탕)
        ingredients: 선택한 재료 리스트 (["고기", "밥"])
        limit: 추천할 음식 개수 (기본 3개)
    
    Returns:
        list: 추천 음식 리스트
    """
    filtered_foods = FOOD_DATABASE.copy()
    
    # 1단계: 카테고리 필터
    if category:
        filtered_foods = [f for f in filtered_foods if f["category"] == category]
    
    # 2단계: 재료 필터 (선택한 재료가 모두 포함된 음식)
    if ingredients:
        filtered_foods = [
            f for f in filtered_foods 
            if all(ing in f["ingredients"] for ing in ingredients)
        ]
    
    # 추천
    if len(filtered_foods) >= limit:
        return random.sample(filtered_foods, limit)
    else:
        return filtered_foods


def chatbot_keyword_match(message: str):
    """
    키워드 매칭 방식 (간단 버전)
    
    Args:
        message: 사용자 메시지
    
    Returns:
        list: 추천 음식 3개
    """
    message = message.lower()
    
    # 카테고리 키워드
    if any(word in message for word in ["한식", "한국", "김치", "국"]):
        return chatbot_filter_recommend(category="한식")
    
    elif any(word in message for word in ["중식", "중국", "짜장", "짬뽕"]):
        return chatbot_filter_recommend(category="중식")
    
    elif any(word in message for word in ["일식", "일본", "초밥", "우동"]):
        return chatbot_filter_recommend(category="일식")
    
    elif any(word in message for word in ["양식", "파스타", "스테이크"]):
        return chatbot_filter_recommend(category="양식")
    
    elif any(word in message for word in ["치킨", "피자", "햄버거", "패스트푸드"]):
        return chatbot_filter_recommend(category="패스트푸드")
    
    elif any(word in message for word in ["분식", "떡볶이", "김밥", "라면"]):
        return chatbot_filter_recommend(category="분식")
    
    elif any(word in message for word in ["찜", "탕", "삼계탕", "갈비탕"]):
        return chatbot_filter_recommend(category="찜/탕")
    
    # 재료 키워드
    elif any(word in message for word in ["고기", "삼겹살", "소고기", "돼지고기"]):
        return chatbot_filter_recommend(ingredients=["고기"])
    
    elif any(word in message for word in ["면", "국수", "파스타", "라면"]):
        return chatbot_filter_recommend(ingredients=["면"])
    
    elif any(word in message for word in ["국물", "찌개", "탕", "국"]):
        return chatbot_filter_recommend(ingredients=["국물"])
    
    elif any(word in message for word in ["밥", "볶음밥", "비빔밥", "덮밥"]):
        return chatbot_filter_recommend(ingredients=["밥"])
    
    elif any(word in message for word in ["튀김", "튀긴", "치킨", "까스"]):
        return chatbot_filter_recommend(ingredients=["튀김"])
    
    elif any(word in message for word in ["해산물", "회", "초밥", "새우"]):
        return chatbot_filter_recommend(ingredients=["해산물"])
    
    elif any(word in message for word in ["닭", "치킨", "삼계탕"]):
        return chatbot_filter_recommend(ingredients=["닭"])
    
    # 기타 키워드
    elif any(word in message for word in ["든든", "배고파", "많이"]):
        # 든든한 음식 = 고기 + 밥
        return chatbot_filter_recommend(ingredients=["고기"])
    
    elif any(word in message for word in ["가벼운", "간단", "샐러드"]):
        return chatbot_filter_recommend(category="양식")
    
    elif any(word in message for word in ["매운", "얼큰", "자극"]):
        # 매운 음식 리스트 (하드코딩)
        spicy_foods = ["김치찌개", "떡볶이", "마라탕", "짬뽕", "깐풍기"]
        return [f for f in FOOD_DATABASE if f["name"] in spicy_foods][:3]
    
    # 매칭 안 되면 랜덤
    else:
        return random.sample(FOOD_DATABASE, 3)


# ============================================
# 테스트 코드
# ============================================

if __name__ == "__main__":
    print("=" * 60)
    print("음식 추천 시스템 테스트")
    print("=" * 60)
    print()
    
    # ===== 1. 날씨 기반 4개 추천 =====
    print("🌧️ 비 오는 날 추천 (4개):")
    recommendations = recommend_4_foods("Rain", 15)
    for i, food in enumerate(recommendations, 1):
        print(f"  {i}. {food['name']} ({food['category']})")
        print(f"     재료: {', '.join(food['ingredients'])}")
        print(f"     이유: {food['reason']}")
        print()
    
    print("-" * 60)
    print()
    
    # ===== 2. 더운 날 추천 =====
    print("☀️ 더운 날 추천 (4개):")
    recommendations = recommend_4_foods("Clear", 32)
    for i, food in enumerate(recommendations, 1):
        print(f"  {i}. {food['name']} ({food['category']})")
        print(f"     이유: {food['reason']}")
        print()
    
    print("-" * 60)
    print()
    
    # ===== 3. 챗봇 - 카테고리 필터 =====
    print("💬 챗봇: '한식' 카테고리 추천:")
    chatbot_result = chatbot_filter_recommend(category="한식", limit=3)
    for food in chatbot_result:
        print(f"  - {food['name']} (재료: {', '.join(food['ingredients'])})")
    print()
    
    # ===== 4. 챗봇 - 재료 필터 =====
    print("💬 챗봇: '고기 + 밥' 재료 추천:")
    chatbot_result = chatbot_filter_recommend(ingredients=["고기", "밥"], limit=3)
    for food in chatbot_result:
        print(f"  - {food['name']} ({food['category']})")
    print()

    
    print("=" * 60)
    print("테스트 완료! ✅")
    print("=" * 60)