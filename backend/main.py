from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="밥토리 API", version="1.0.0")

# CORS 설정
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "밥토리 백엔드 연결 완료!", "version": "1.0.0"}

# Mock 날씨 API
@app.get("/weather")
def get_weather_mock(lat: float = 35.8714, lon: float = 128.6014):
    return {
        "location": "대구",
        "temperature": 25.0,
        "condition": "맑음",
        "humidity": 60
    }

# Mock 맛집 API
@app.get("/places")
def get_places_mock(keyword: str = "맛집"):
    return {
        "keyword": keyword,
        "places": [
            {"name": "맛집1", "category": "한식", "distance": 100},
            {"name": "맛집2", "category": "중식", "distance": 150},
            {"name": "맛집3", "category": "일식", "distance": 200}
        ]
    }