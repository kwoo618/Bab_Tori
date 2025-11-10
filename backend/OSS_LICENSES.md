# 오픈소스 라이선스 명세

본 프로젝트에서 사용한 오픈소스 라이브러리 및 참고 프로젝트

---

## 🎮 1. Tamagotchi Clone (핵심 오픈소스)

**프로젝트명:** Tamagotchi Clone  
**저작자:** Chris Lo (ChrisChrisLoLo)  
**저장소:** https://github.com/ChrisChrisLoLo/tamagotchiClone  
**라이선스:** MIT License  
**사용 목적:** 캐릭터 육성 시스템 설계 참고

---

## 📊 활용 내용 상세 설명

### 1) 원본 구조 분석

**Tamagotchi Clone의 핵심 시스템 (JavaScript):**

```javascript
// 출처: https://github.com/ChrisChrisLoLo/tamagotchiClone
class Tamagotchi {
  constructor() {
    this.hunger = 0;        // 배고픔 (0-100, 높을수록 배고픔)
    this.happiness = 100;   // 행복도 (0-100, 높을수록 행복)
    this.health = 100;      // 건강 (0-100, 높을수록 건강)
    this.age = 0;           // 나이 (시간이 지나면 증가)
    this.weight = 20;       // 몸무게 (먹으면 증가)
  }
  
  // 먹이기 (배고픔 감소, 행복도 증가)
  feed() {
    this.hunger = Math.max(0, this.hunger - 10);
    this.happiness = Math.min(100, this.happiness + 5);
    this.weight += 1;
  }
  
  // 놀아주기 (행복도 증가)
  play() {
    this.happiness = Math.min(100, this.happiness + 10);
    this.weight -= 1;
  }
  
  // 재우기 (건강 증가)
  sleep() {
    this.health = Math.min(100, this.health + 20);
  }
  
  // 시간 경과 (모든 수치 감소)
  tick() {
    this.hunger = Math.min(100, this.hunger + 5);
    this.happiness = Math.max(0, this.happiness - 3);
    this.health = Math.max(0, this.health - 2);
    this.age += 1;
  }
}
```

---

### 2) 우리 프로젝트에 맞게 변형

**변형된 구조 (Python - 밥토리):**

```python
# 파일: models.py
# Tamagotchi Clone을 참고하여 음식 앱에 맞게 재설계

class CharacterState(Base):
    """캐릭터 상태 테이블
    
    Tamagotchi Clone의 캐릭터 시스템을 참고하여 제작
    출처: https://github.com/ChrisChrisLoLo/tamagotchiClone
    """
    __tablename__ = "character_states"
    
    # 캐릭터 상태 (Tamagotchi 참고)
    satiety = Column(Integer, default=50)      # 포만감 (hunger 변형)
    friendship = Column(Integer, default=0)    # 친밀도 (happiness 변형)
    exp = Column(Integer, default=0)           # 경험치 (추가)
    level = Column(Integer, default=1)         # 레벨 (age 변형)
```

---

### 3) 주요 변경사항 및 이유

#### 속성 변경

| Tamagotchi 원본 | 밥토리 변형 | 변경 이유 |
|-----------------|------------|----------|
| hunger (배고픔) | satiety (포만감) | 의미 반전 - 더 직관적 |
| happiness (행복도) | friendship (친밀도) | 음식 테마에 맞게 |
| health (건강) | 제거 | 단순화 |
| age (나이) | level + exp | 게임화 확장 |
| weight (몸무게) | 제거 | 단순화 |

#### 기능 변형

| Tamagotchi 원본 | 밥토리 변형 |
|-----------------|------------|
| feed() | 음식 선택 (차등 보상) |
| play() | 제거 (통합) |
| sleep() | 제거 (단순화) |
| tick() | 포만감만 자동 감소 |

---

### 4) 코드 활용 예시

**원본 (JavaScript):**
```javascript
feed() {
  this.hunger = Math.max(0, this.hunger - 10);
  this.happiness = Math.min(100, this.happiness + 5);
}
```

**변형 (Python):**
```python
# main.py - 음식 선택 (feed 변형)
character.satiety = min(100, character.satiety + 40)
character.friendship = min(100, character.friendship + 20)
character.exp += 50
```

---

## 📜 MIT License 전문

```
MIT License

Copyright (c) 2019 Chris Lo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📚 2. Python 라이브러리

- FastAPI (MIT License)
- SQLAlchemy (MIT License)
- Uvicorn (BSD-3-Clause)
- httpx (BSD License)
- psycopg2-binary (LGPL)
- python-dotenv (BSD License)

---

**작성자:** 밥토리 팀 (최강우, 박승민)  
**날짜:** 2024-11-10
