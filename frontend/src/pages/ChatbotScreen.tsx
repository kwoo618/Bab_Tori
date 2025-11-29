"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, Send, Bot } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  options?: string[]
}

interface ChatbotScreenProps {
  onBack: () => void
}

export default function ChatbotScreen({ onBack }: ChatbotScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕! 난 밥토리야. 뭘 도와줄까?",
      sender: "bot",
      options: ["메뉴 추천해줘", "오늘 날씨 어때?", "심심해"],
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text: string) => {
    if (!text.trim()) return

    // 사용자 메시지 추가
    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    // 봇 응답 시뮬레이션 (협업자가 실제 API 연동)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "이 기능은 챗봇 API와 연동될 예정이야! (협업자 구현)",
          sender: "bot",
        },
      ])
    }, 1000)
  }

  return (
    <div className="p-4 py-10 space-y-4 h-[80vh] flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bot className="text-primary" />
          밥토리 챗봇
        </h1>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronUp size={24} />
        </button>
      </div>

      {/* 채팅 영역 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.sender === "user"
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
        />
        <button
          onClick={() => handleSend(input)}
          className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
