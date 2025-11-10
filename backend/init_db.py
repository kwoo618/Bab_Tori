"""
데이터베이스 초기화 스크립트
<<<<<<< HEAD
테이블 생성 및 초기 데이터 추가
"""

from database import engine, SessionLocal, Base, test_connection
from models import CharacterState, FoodRecord, UserPreference


def create_tables():
    """모든 테이블 생성"""
    print("📋 테이블을 생성합니다...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ 테이블 생성 완료!")
        print()
        print("생성된 테이블:")
        print("  - character_states")
        print("  - food_records")
        print("  - user_preferences")
        return True
    except Exception as e:
        print(f"❌ 테이블 생성 실패: {e}")
        return False
=======
테이블을 생성하고 초기 데이터를 추가합니다.
"""

from database import engine, SessionLocal
from models import Base, CharacterState, UserPreference

def init_db():
    """데이터베이스 테이블 생성"""
    print("데이터베이스 테이블을 생성합니다...")
    Base.metadata.create_all(bind=engine)
    print("✅ 테이블 생성 완료!")
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823


def create_default_character():
    """기본 캐릭터 생성"""
    db = SessionLocal()
    
    try:
<<<<<<< HEAD
        # 기본 사용자 캐릭터 확인
        existing = db.query(CharacterState).filter(
            CharacterState.user_id == "default_user"
        ).first()
        
        if existing:
            print("⚠️  기본 캐릭터가 이미 존재합니다.")
            print(f"   레벨: {existing.level}, 포만감: {existing.satiety}%, 친밀도: {existing.friendship}%")
=======
        # 기본 사용자 확인
        existing_character = db.query(CharacterState).filter(
            CharacterState.user_id == "default_user"
        ).first()
        
        if existing_character:
            print("⚠️ 기본 캐릭터가 이미 존재합니다.")
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
            return
        
        # 새 캐릭터 생성
        character = CharacterState(
            user_id="default_user",
<<<<<<< HEAD
            satiety=50,  # 포만감 50%
            friendship=0,  # 친밀도 0%
=======
            hunger=50,
            satiety=50,
            mood="보통",
            fatigue=50,
            happiness=50,
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
            exp=0,
            level=1
        )
        
        db.add(character)
        db.commit()
<<<<<<< HEAD
        db.refresh(character)
        
        print("✅ 기본 캐릭터 생성 완료!")
        print(f"   사용자 ID: {character.user_id}")
        print(f"   레벨: {character.level}")
        print(f"   포만감: {character.satiety}%")
        print(f"   친밀도: {character.friendship}%")
        
    except Exception as e:
        print(f"❌ 캐릭터 생성 실패: {e}")
=======
        print("✅ 기본 캐릭터 생성 완료!")
        
    except Exception as e:
        print(f"❌ 에러 발생: {e}")
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
        db.rollback()
    
    finally:
        db.close()


def create_default_preference():
    """기본 사용자 선호도 생성"""
    db = SessionLocal()
    
    try:
        # 기본 선호도 확인
<<<<<<< HEAD
        existing = db.query(UserPreference).filter(
            UserPreference.user_id == "default_user"
        ).first()
        
        if existing:
            print("⚠️  기본 선호도가 이미 존재합니다.")
=======
        existing_pref = db.query(UserPreference).filter(
            UserPreference.user_id == "default_user"
        ).first()
        
        if existing_pref:
            print("⚠️ 기본 선호도가 이미 존재합니다.")
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
            return
        
        # 새 선호도 생성
        preference = UserPreference(
            user_id="default_user",
<<<<<<< HEAD
            favorite_categories=None,
            dislike_categories=None,
            allergies=None,
            dietary_restrictions=None
=======
            favorite_categories="한식,중식",
            spicy_preference=3,
            price_range="보통"
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
        )
        
        db.add(preference)
        db.commit()
<<<<<<< HEAD
        
        print("✅ 기본 선호도 생성 완료!")
        
    except Exception as e:
        print(f"❌ 선호도 생성 실패: {e}")
=======
        print("✅ 기본 선호도 생성 완료!")
        
    except Exception as e:
        print(f"❌ 에러 발생: {e}")
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
        db.rollback()
    
    finally:
        db.close()


<<<<<<< HEAD
def drop_all_tables():
    """모든 테이블 삭제 (주의!)"""
    print("⚠️  경고: 모든 테이블을 삭제합니다!")
    confirm = input("정말로 삭제하시겠습니까? (yes/no): ")
    
    if confirm.lower() == "yes":
        try:
            Base.metadata.drop_all(bind=engine)
            print("✅ 모든 테이블이 삭제되었습니다.")
        except Exception as e:
            print(f"❌ 테이블 삭제 실패: {e}")
    else:
        print("취소되었습니다.")


def reset_database():
    """데이터베이스 초기화 (모든 테이블 삭제 후 재생성)"""
    print("=" * 50)
    print("데이터베이스 초기화")
    print("=" * 50)
    print()
    
    # 1. 모든 테이블 삭제
    drop_all_tables()
    print()
    
    # 2. 테이블 재생성
    if create_tables():
        print()
        
        # 3. 기본 데이터 생성
        create_default_character()
        print()
        create_default_preference()


=======
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
if __name__ == "__main__":
    print("=" * 50)
    print("밥토리 데이터베이스 초기화")
    print("=" * 50)
    print()
    
<<<<<<< HEAD
    # 1. 데이터베이스 연결 테스트
    print("1️⃣ 데이터베이스 연결 테스트...")
    if not test_connection():
        print()
        print("데이터베이스 연결에 실패했습니다.")
        print("PostgreSQL이 실행 중인지 확인하세요.")
        exit(1)
    
    print()
    
    # 2. 테이블 생성
    print("2️⃣ 테이블 생성...")
    if not create_tables():
        print()
        print("테이블 생성에 실패했습니다.")
        exit(1)
    
    print()
    
    # 3. 기본 데이터 생성
    print("3️⃣ 기본 데이터 생성...")
    create_default_character()
    print()
=======
    # 1. 테이블 생성
    init_db()
    print()
    
    # 2. 기본 데이터 생성
    create_default_character()
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
    create_default_preference()
    
    print()
    print("=" * 50)
<<<<<<< HEAD
    print("초기화 완료! ✅")
    print("=" * 50)
    print()
    print("다음 단계:")
    print("1. python main.py 실행")
    print("2. http://localhost:8000/docs 접속")
    print("3. API 테스트 시작!")
=======
    print("초기화 완료!")
    print("=" * 50)
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
