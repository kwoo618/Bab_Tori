from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "밥토리 백엔드 연결 완료!"}
