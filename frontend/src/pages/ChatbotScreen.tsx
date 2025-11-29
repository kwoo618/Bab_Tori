"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, Send } from "lucide-react"

interface Message {
  text: string
  sender: "user" | "bot"
  timestamp?: string
}

interface ChatbotScreenProps {
  onBack: () => void
}

export default function ChatbotScreen({ onBack }: ChatbotScreenProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 컴포넌트가 마운트될 때 세션 ID를 생성하고 초기 메시지를 설정합니다.
    setSessionId(`session_${Date.now()}`)
    setMessages([
      {
        sender: "bot",
        text: "안녕하세요! 오늘 어떤 음식이 땡기시나요?",
      },
    ])
  }, [])

  useEffect(() => {
    // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동시킵니다.
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // 사용자 메시지 추가
    const userMsg: Message = {
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: input,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error("서버에서 응답을 받지 못했습니다.")
      }

      const initialBotMessage: Message = { sender: "bot", text: "" }
      setMessages((prev) => [...prev, initialBotMessage])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, text: msg.text + chunk } : msg
          ),
        )
      }
    } catch (error) {
      console.error("챗봇 API 통신 오류:", error)
      const errorMessage: Message = {
        sender: "bot",
        text: "죄송해요, 지금은 답변을 드릴 수 없어요. 잠시 후 다시 시도해주세요.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 py-10 space-y-4 h-[80vh] flex flex-col">
      {/* 상단 뒤로가기 버튼 */}
      <div className="flex items-center justify-end">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronUp size={24} />
        </button>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto space-y-6 p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "bot" && (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                😋
              </div>
            )}

            <div className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`max-w-[70vw] md:max-w-[300px] p-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.sender === "bot" && (
                  <p className="font-bold text-sm mb-1">밥토리</p>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.sender === "user" && msg.timestamp && (
                <span className="text-xs text-gray-400 mb-1">{msg.timestamp}</span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
              😋
            </div>
            <div className="ml-2 bg-gray-100 p-3 rounded-2xl rounded-bl-none">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white disabled:bg-gray-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md disabled:bg-primary/50 disabled:cursor-not-allowed"
          disabled={isLoading || !input.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}
