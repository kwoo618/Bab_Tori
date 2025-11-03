<<<<<<< HEAD
"""
데이터베이스 모델 정의
Tamagotchi Clone 참고: https://github.com/ChrisChrisLoLo/tamagotchiClone
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.sql import func
from database import Base


# ============================================
# 캐릭터 상태 모델 (Tamagotchi 참고)
# ============================================

class CharacterState(Base):
    """
    캐릭터 상태 테이블
    
    Tamagotchi Clone의 캐릭터 시스템을 참고하여 제작
    - 원본: hunger, happiness, health, age
    - 변경: satiety, friendship (단순화)
    
    출처: https://github.com/ChrisChrisLoLo/tamagotchiClone
    """
    __tablename__ = "character_states"
    
    # 기본 키
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(50), default="default_user", index=True)
    
    # 캐릭터 상태 (Tamagotchi 참고)
    satiety = Column(Integer, default=50)  # 포만감 (0-100)
    friendship = Column(Integer, default=0)  # 친밀도 (0-100)
    
    # 성장 시스템 (Tamagotchi 참고)
    exp = Column(Integer, default=0)  # 경험치
    level = Column(Integer, default=1)  # 레벨
    
    # 시간 정보
    last_meal_time = Column(DateTime(timezone=True), nullable=True)
    last_update_time = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Character(level={self.level}, satiety={self.satiety}, friendship={self.friendship})>"
    
    def to_dict(self):
        """딕셔너리로 변환"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "satiety": self.satiety,
            "friendship": self.friendship,
            "exp": self.exp,
            "level": self.level,
            "last_meal_time": self.last_meal_time.isoformat() if self.last_meal_time else None,
            "last_update_time": self.last_update_time.isoformat() if self.last_update_time else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# ============================================
# 음식 기록 모델
# ============================================

class FoodRecord(Base):
    """
    음식 선택 기록 테이블
    사용자가 먹은 음식을 기록 (음식 일기/도감용)
    """
    __tablename__ = "food_records"
    
    # 기본 키
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(50), default="default_user", index=True)
    
    # 음식 정보
    food_name = Column(String(100), nullable=False, index=True)
    category = Column(String(50), nullable=True)  # 한식, 중식, 일식 등
    ingredients = Column(String(200), nullable=True)  # 고기/면/국물 등
    
    # 추천 여부
    is_recommended = Column(Boolean, default=False)  # 밥토리가 추천한 음식인지
    
    # 보상 정보
    satiety_gain = Column(Integer, default=0)  # 포만감 증가량
    friendship_gain = Column(Integer, default=0)  # 친밀도 증가량
    exp_gain = Column(Integer, default=0)  # 경험치 증가량
    
    # 사진 정보
    photo_url = Column(Text, nullable=True)  # 음식 인증 사진 URL
    
    # 날씨 정보 (기록 시점)
    weather_condition = Column(String(50), nullable=True)  # Rain, Clear 등
    temperature = Column(Float, nullable=True)  # 온도
    
    # 위치 정보
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # 시간 정보
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    def __repr__(self):
        return f"<FoodRecord(food_name='{self.food_name}', is_recommended={self.is_recommended})>"
    
    def to_dict(self):
        """딕셔너리로 변환"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "food_name": self.food_name,
            "category": self.category,
            "ingredients": self.ingredients,
            "is_recommended": self.is_recommended,
            "satiety_gain": self.satiety_gain,
            "friendship_gain": self.friendship_gain,
            "exp_gain": self.exp_gain,
            "photo_url": self.photo_url,
            "weather_condition": self.weather_condition,
            "temperature": self.temperature,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# ============================================
# 사용자 선호도 모델 (추후 확장)
# ============================================

class UserPreference(Base):
    """
    사용자 선호도 테이블
    AI 추천 최적화를 위한 데이터
    """
    __tablename__ = "user_preferences"
    
    # 기본 키
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(50), default="default_user", unique=True, index=True)
    
    # 선호 정보
    favorite_categories = Column(String(200), nullable=True)  # "한식,중식,일식"
    dislike_categories = Column(String(200), nullable=True)
    favorite_ingredients = Column(String(200), nullable=True)  # "고기,면,국물"
    dislike_ingredients = Column(String(200), nullable=True)
    
    # 알러지/제한사항
    allergies = Column(String(200), nullable=True)  # "새우,땅콩"
    dietary_restrictions = Column(String(200), nullable=True)  # "채식,비건"
    
    # 시간 정보
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<UserPreference(user_id='{self.user_id}')>"
    
    def to_dict(self):
        """딕셔너리로 변환"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "favorite_categories": self.favorite_categories,
            "dislike_categories": self.dislike_categories,
            "favorite_ingredients": self.favorite_ingredients,
            "dislike_ingredients": self.dislike_ingredients,
            "allergies": self.allergies,
            "dietary_restrictions": self.dietary_restrictions
        }
=======
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class CharacterState(Base):
    """캐릭터 상태 테이블"""
    __tablename__ = "character_states"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, default="default_user", index=True)  # 추후 사용자 인증 추가 시 사용
    
    # 캐릭터 기본 상태
    hunger = Column(Integer, default=50)  # 배고픔 (0-100)
    satiety = Column(Integer, default=50)  # 포만감 (0-100)
    mood = Column(String, default="보통")  # 기분 (우울, 보통, 좋음, 최고)
    fatigue = Column(Integer, default=50)  # 피로도 (0-100)
    happiness = Column(Integer, default=50)  # 행복도 (0-100)
    
    # 성장 관련
    exp = Column(Integer, default=0)  # 경험치
    level = Column(Integer, default=1)  # 레벨
    
    # 추가 정보
    last_meal_time = Column(DateTime(timezone=True), nullable=True)  # 마지막 식사 시간
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class FoodRecord(Base):
    """음식 선택 기록 테이블"""
    __tablename__ = "food_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, default="default_user", index=True)
    
    # 음식 정보
    food_name = Column(String, nullable=False)  # 음식 이름
    restaurant_name = Column(String, nullable=True)  # 맛집 이름
    category = Column(String, nullable=True)  # 음식 카테고리 (한식, 중식, 일식 등)
    
    # 위치 정보
    latitude = Column(Float, nullable=True)  # 위도
    longitude = Column(Float, nullable=True)  # 경도
    
    # 날씨 정보 (기록 시점)
    weather_condition = Column(String, nullable=True)  # 날씨 상태 (맑음, 비 등)
    temperature = Column(Float, nullable=True)  # 온도
    
    # 사용자 피드백
    rating = Column(Integer, nullable=True)  # 평점 (1-5)
    photo_url = Column(String, nullable=True)  # 음식 인증 사진 URL
    
    # 시간 정보
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserPreference(Base):
    """사용자 선호도 테이블 (추후 AI 추천 최적화용)"""
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, default="default_user", index=True)
    
    # 선호 카테고리
    favorite_categories = Column(String, nullable=True)  # JSON 형식으로 저장 (예: "한식,중식,일식")
    dislike_categories = Column(String, nullable=True)
    
    # 알러지/제한사항
    allergies = Column(String, nullable=True)  # 알러지 정보
    dietary_restrictions = Column(String, nullable=True)  # 식이 제한 (채식, 비건 등)
    
    # 기타 설정
    spicy_preference = Column(Integer, default=3)  # 매운맛 선호도 (1-5)
    price_range = Column(String, default="보통")  # 가격대 (저렴, 보통, 비쌈)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
>>>>>>> 0e85058ab27e54e2ec28e7ca5bd9e7ab63b62823
