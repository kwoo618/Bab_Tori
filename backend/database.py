<<<<<<< HEAD
"""
PostgreSQL 데이터베이스 연결 설정
SQLAlchemy를 사용한 DB 연결 관리
"""
=======
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

<<<<<<< HEAD
# 환경변수 로드
load_dotenv()

# 데이터베이스 URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:qwer1234@localhost:5432/babtori_db"
)

# SQLAlchemy 엔진 생성
engine = create_engine(
    DATABASE_URL,
    echo=True,  # SQL 쿼리 로그 출력 (개발 시)
    pool_pre_ping=True,  # 연결 상태 확인
    pool_size=10,  # 커넥션 풀 크기
    max_overflow=20  # 최대 초과 연결 수
)

# 세션 로컬 생성
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base 클래스 생성 (모든 모델의 부모 클래스)
Base = declarative_base()


# ============================================
# DB 세션 의존성 (FastAPI에서 사용)
# ============================================

def get_db():
    """
    FastAPI Depends에서 사용할 DB 세션 생성기
    
    Usage:
        @app.get("/items")
        def read_items(db: Session = Depends(get_db)):
            ...
    """
=======
# .env 파일 로드
load_dotenv()

# 환경변수에서 DATABASE_URL 가져오기
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:qwer1234@localhost:5432/babtori_db")

# SQLAlchemy 엔진 생성
engine = create_engine(DATABASE_URL)

# 세션 로컬 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스 생성
Base = declarative_base()

# DB 세션 의존성
def get_db():
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
    db = SessionLocal()
    try:
        yield db
    finally:
<<<<<<< HEAD
        db.close()


# ============================================
# DB 연결 테스트
# ============================================

def test_connection():
    """데이터베이스 연결 테스트"""
    try:
        # 연결 테스트
        connection = engine.connect()
        print("✅ 데이터베이스 연결 성공!")
        connection.close()
        return True
    except Exception as e:
        print(f"❌ 데이터베이스 연결 실패: {e}")
        return False


if __name__ == "__main__":
    print("=" * 50)
    print("데이터베이스 연결 테스트")
    print("=" * 50)
    print()
    print(f"DATABASE_URL: {DATABASE_URL}")
    print()
    
    if test_connection():
        print()
        print("데이터베이스가 정상적으로 연결되었습니다! ✅")
    else:
        print()
        print("데이터베이스 연결에 문제가 있습니다. ❌")
        print()
        print("해결 방법:")
        print("1. PostgreSQL이 실행 중인지 확인")
        print("2. .env 파일에 DATABASE_URL이 올바른지 확인")
        print("3. babtori_db 데이터베이스가 생성되었는지 확인")
        print("   → CREATE DATABASE babtori_db;")
=======
        db.close()
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
