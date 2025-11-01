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