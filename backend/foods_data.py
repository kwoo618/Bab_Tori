"""
음식 데이터베이스 (CSV 기반)
140개 음식 데이터 로드 및 검색 기능
"""

import csv
import os

# CSV 파일 경로
CSV_FILE = "foods_database.csv"

# 전역 변수: 음식 데이터베이스
FOOD_DATABASE = []


def load_foods_from_csv():
    """CSV 파일에서 음식 데이터 로드"""
    global FOOD_DATABASE
    
    if not os.path.exists(CSV_FILE):
        print(f"⚠️  {CSV_FILE} 파일을 찾을 수 없습니다.")
        return []
    
    FOOD_DATABASE = []
    
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # 재료를 리스트로 변환
                ingredients = row['ingredients'].split(',') if row['ingredients'] else []
                ingredients = [ing.strip() for ing in ingredients]
                
                FOOD_DATABASE.append({
                    'name': row['name'],
                    'category': row['category'],
                    'ingredients': ingredients
                })
        
        print(f"✅ {len(FOOD_DATABASE)}개의 음식 데이터를 로드했습니다.")
        return FOOD_DATABASE
    
    except Exception as e:
        print(f"❌ CSV 파일 읽기 오류: {e}")
        return []


def get_all_foods():
    """전체 음식 리스트 반환"""
    if not FOOD_DATABASE:
        load_foods_from_csv()
    return FOOD_DATABASE


def get_foods_by_category(category: str):
    """
    카테고리별 음식 검색
    
    Args:
        category: 카테고리 이름 (한식, 중식, 일식, 양식, 패스트푸드, 분식, 찜/탕)
    
    Returns:
        list: 해당 카테고리의 음식 리스트
    """
    if not FOOD_DATABASE:
        load_foods_from_csv()
    
    return [food for food in FOOD_DATABASE if food['category'] == category]


def get_foods_by_ingredient(ingredient: str):
    """
    재료별 음식 검색
    
    Args:
        ingredient: 재료 이름 (고기, 면, 국물, 밥, 튀김, 해산물, 닭, 야채)
    
    Returns:
        list: 해당 재료가 포함된 음식 리스트
    """
    if not FOOD_DATABASE:
        load_foods_from_csv()
    
    return [food for food in FOOD_DATABASE if ingredient in food['ingredients']]


def get_foods_by_ingredients(ingredients: list):
    """
    여러 재료로 음식 검색 (모든 재료 포함)
    
    Args:
        ingredients: 재료 리스트 (["고기", "밥"])
    
    Returns:
        list: 모든 재료가 포함된 음식 리스트
    """
    if not FOOD_DATABASE:
        load_foods_from_csv()
    
    return [
        food for food in FOOD_DATABASE
        if all(ing in food['ingredients'] for ing in ingredients)
    ]


def get_categories():
    """모든 카테고리 목록 반환"""
    if not FOOD_DATABASE:
        load_foods_from_csv()
    
    categories = set(food['category'] for food in FOOD_DATABASE)
    return sorted(categories)


def get_ingredients():
    """모든 재료 목록 반환"""
    if not FOOD_DATABASE:
        load_foods_from_csv()
    
    ingredients = set()
    for food in FOOD_DATABASE:
        ingredients.update(food['ingredients'])
    
    return sorted(ingredients)


# ============================================
# 자동 로드
# ============================================

# 모듈 import 시 자동으로 데이터 로드
load_foods_from_csv()


# ============================================
# 테스트 코드
# ============================================

if __name__ == "__main__":
    print("=" * 60)
    print("음식 데이터베이스 테스트 (CSV 버전)")
    print("=" * 60)
    print()
    
    # 1. 전체 음식 개수
    foods = get_all_foods()
    print(f"📊 전체 음식 개수: {len(foods)}개")
    print()
    
    # 2. 카테고리별 개수
    print("📋 카테고리별 음식 개수:")
    categories = get_categories()
    for category in categories:
        count = len(get_foods_by_category(category))
        print(f"  - {category}: {count}개")
    print()
    
    # 3. 재료별 개수
    print("🥘 재료별 음식 개수:")
    ingredients = get_ingredients()
    for ingredient in ingredients:
        count = len(get_foods_by_ingredient(ingredient))
        print(f"  - {ingredient}: {count}개")
    print()
    
    # 4. 카테고리 검색 예시
    print("🔍 '한식' 카테고리 검색 (5개만):")
    korean_foods = get_foods_by_category("한식")
    for i, food in enumerate(korean_foods[:5], 1):
        print(f"  {i}. {food['name']} - 재료: {', '.join(food['ingredients'])}")
    print()
    
    # 5. 재료 검색 예시
    print("🔍 '고기' 재료 검색 (5개만):")
    meat_foods = get_foods_by_ingredient("고기")
    for i, food in enumerate(meat_foods[:5], 1):
        print(f"  {i}. {food['name']} ({food['category']})")
    print()
    
    # 6. 복합 재료 검색
    print("🔍 '고기 + 밥' 재료 검색:")
    meat_rice_foods = get_foods_by_ingredients(["고기", "밥"])
    for i, food in enumerate(meat_rice_foods[:5], 1):
        print(f"  {i}. {food['name']} ({food['category']})")
    print()
    
    print("=" * 60)
    print("테스트 완료! ✅")
    print("=" * 60)