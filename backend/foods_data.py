import csv
from typing import List, Dict

FOOD_DATABASE: List[Dict] = []

def load_foods_from_csv(csv_path: str = "foods/foods.csv") -> None:
    """CSV에서 음식 데이터 로드해서 FOOD_DATABASE에 채우기"""
    global FOOD_DATABASE
    if FOOD_DATABASE:
        return  # 이미 로드된 경우

    try:
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            FOOD_DATABASE = [row for row in reader]
    except FileNotFoundError:
        print(f"[foods_data] CSV 파일을 찾을 수 없습니다: {csv_path}")
        FOOD_DATABASE = []