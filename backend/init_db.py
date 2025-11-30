import os
import csv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
# models 모듈을 임포트하여 Base에 테이블 메타데이터가 등록되도록 합니다.
import models
# FastAPI 프로젝트의 모델과 데이터베이스 설정을 가져옵니다.
from database import Base

# .env 파일에서 환경 변수 로드
load_dotenv()

# 데이터베이스 연결 URL 가져오기
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL 환경 변수가 설정되지 않았습니다.")

# 데이터베이스 엔진 생성
engine = create_engine(DATABASE_URL)

# 세션 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    db = SessionLocal()
    try:
        print("데이터베이스 초기화를 시작합니다...")

        # 0. 데이터베이스 테이블 생성 (없는 경우)
        print("데이터베이스 테이블을 확인하고, 없는 경우 생성합니다...")
        Base.metadata.create_all(bind=engine)
        print("테이블 준비 완료.")

        # 1. 사용자 관련 데이터 초기화 (캐릭터 상태, 음식 기록 등)
        print("사용자 관련 데이터를 초기화합니다 (캐릭터, 음식일기, 선호도)...")
        db.execute(text("TRUNCATE TABLE character_states RESTART IDENTITY CASCADE"))
        db.execute(text("TRUNCATE TABLE food_records RESTART IDENTITY CASCADE"))
        db.execute(text("TRUNCATE TABLE user_preferences RESTART IDENTITY CASCADE"))
        db.commit()
        print("사용자 데이터 초기화 완료.")

        # 2. 기존 'foods' 테이블의 모든 데이터 삭제 (TRUNCATE)
        # CASCADE를 사용하여 외래 키 제약 조건이 있는 경우에도 삭제합니다.
        print("기존 음식 데이터를 새로고침합니다...")
        db.execute(text("TRUNCATE TABLE foods RESTART IDENTITY CASCADE"))
        db.commit()
        print("기존 음식 데이터 삭제 완료.")

        # 3. foods_database.csv 파일 읽기
        print("CSV 파일에서 새로운 데이터를 읽어옵니다...")
        with open('foods_database.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            foods_to_add = list(reader)

        # 3. CSV 데이터를 데이터베이스에 삽입
        print(f"{len(foods_to_add)}개의 음식 데이터를 데이터베이스에 추가합니다...")

        for food in foods_to_add:
            # description이 없는 경우를 대비하여 기본값 설정
            description = food.get('description', f"{food['name']}입니다. 맛있게 드세요!")
            
            stmt = text("""
                INSERT INTO foods (name, category, ingredients, image_url, description)
                VALUES (:name, :category, :ingredients, :image_url, :description)
            """)
            db.execute(stmt, {**food, 'description': description})
        
        db.commit()
        print("새로운 음식 데이터 추가 완료!")
        print("데이터베이스 초기화가 성공적으로 완료되었습니다.")

    finally:
        db.close()

if __name__ == "__main__":
    init_db()