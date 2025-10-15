from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # 1. CORSMiddleware 임포트

app = FastAPI()

# 2. CORS 미들웨어 추가
origins = [
    "http://localhost:3000", # React 앱의 주소
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "밥토리 백엔드 연결 완료!"}

# 다음 목표: 여기에 /weather API, /places API를 만듭니다.