"""
데이터베이스 초기화 스크립트
테이블을 생성하고 초기 데이터를 추가합니다.
"""

from database import engine, SessionLocal
from models import Base, CharacterState, UserPreference

def init_db():
    """데이터베이스 테이블 생성"""
    print("데이터베이스 테이블을 생성합니다...")
    Base.metadata.create_all(bind=engine)
    print("✅ 테이블 생성 완료!")


def create_default_character():
    """기본 캐릭터 생성"""
    db = SessionLocal()
    
    try:
        # 기본 사용자 확인
        existing_character = db.query(CharacterState).filter(
            CharacterState.user_id == "default_user"
        ).first()
        
        if existing_character:
            print("⚠️ 기본 캐릭터가 이미 존재합니다.")
            return
        
        # 새 캐릭터 생성
        character = CharacterState(
            user_id="default_user",
            hunger=50,
            satiety=50,
            mood="보통",
            fatigue=50,
            happiness=50,
            exp=0,
            level=1
        )
        
        db.add(character)
        db.commit()
        print("✅ 기본 캐릭터 생성 완료!")
        
    except Exception as e:
        print(f"❌ 에러 발생: {e}")
        db.rollback()
    
    finally:
        db.close()


def create_default_preference():
    """기본 사용자 선호도 생성"""
    db = SessionLocal()
    
    try:
        # 기본 선호도 확인
        existing_pref = db.query(UserPreference).filter(
            UserPreference.user_id == "default_user"
        ).first()
        
        if existing_pref:
            print("⚠️ 기본 선호도가 이미 존재합니다.")
            return
        
        # 새 선호도 생성
        preference = UserPreference(
            user_id="default_user",
            favorite_categories="한식,중식",
            spicy_preference=3,
            price_range="보통"
        )
        
        db.add(preference)
        db.commit()
        print("✅ 기본 선호도 생성 완료!")
        
    except Exception as e:
        print(f"❌ 에러 발생: {e}")
        db.rollback()
    
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 50)
    print("밥토리 데이터베이스 초기화")
    print("=" * 50)
    print()
    
    # 1. 테이블 생성
    init_db()
    print()
    
    # 2. 기본 데이터 생성
    create_default_character()
    create_default_preference()
    
    print()
    print("=" * 50)
    print("초기화 완료!")
    print("=" * 50)