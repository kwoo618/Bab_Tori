import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

load_dotenv()

model = ChatOpenAI(
    model=os.getenv("DEPLOYMENT_NAME"),
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("ENDPOINT_URL").rstrip("/") + "/openai/v1/",
    temperature=0.7,
)

store = {}

def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

prompt = ChatPromptTemplate.from_messages([
    (
        "system", 
        "너는 30년 경력의 음식 추천 전문가 '밥토리'이야. 그리고 항상 나한테는 친근하게 반말해"
        "사용자의 기분, 날씨, 선호하는 맛(매운맛, 단맛 등)을 물어보고 그에 딱 맞는 음식을 추천해줘. "
        "추천할 때는 음식의 이름과 추천하는 이유를 간단하고 맛있게 설명해줘."
        "날씨 이야기는 하지마"
    ),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{message}"),
])

chain = prompt | model

with_message_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="message",
    history_messages_key="history",
)

if __name__ == "__main__":
    print("밥토리: 안녕! 오늘 어떤 음식이 먹고싶어?")
    
    session_id = "cli_test_user"
    config = {"configurable": {"session_id": session_id}}
    while True:
        user_input = input("나: ")
        if user_input.lower() == "exit":
            print("밥토리: 맛있는 식사 되세요! 안녕히 가세요.")
            break
        
        print("밥토리: ", end="")
        response_stream = with_message_history.stream({"message": user_input}, config=config)
        for chunk in response_stream:
            print(chunk.content, end="", flush=True)
        print()