"use client"

import { useEffect, useRef, useState } from "react"
import { X, Send } from "lucide-react"
import { useCharacter } from "../hooks/useCharacter"
import { getCatImageByLevel } from "../lib/characterImage"

interface Message {
  text: string
  sender: "user" | "bot"
  timestamp?: string
}

interface ChatModalProps {
  onClose: () => void
}

export default function ChatModal({ onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { character } = useCharacter()
  const catSrc = getCatImageByLevel(character?.level ?? 0)

  // 처음 열릴 때 세션 아이디 + 인사 메시지
  useEffect(() => {
    setSessionId(`session_${Date.now()}`)
    setMessages([
      {
        sender: "bot",
        text: "안녕! 나는 밥토리야 😊\n오늘은 어떤 음식이 땡겨? 편하게 말해줘!",
      },
    ])
  }, [])

  // 메시지 추가될 때마다 스크롤 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userInput = input
    const userMsg: Message = {
      text: userInput,
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
          message: userInput,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error("서버에서 응답을 받지 못했습니다.")
      }

      // 빈 봇 메시지 추가 후 스트리밍으로 내용 채우기
      setMessages((prev) => [...prev, { sender: "bot", text: "" }])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)

        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, text: msg.text + chunk } : msg,
          ),
        )
      }
    } catch (error) {
      console.error("챗봇 API 통신 오류:", error)
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "죄송해요, 지금은 답변을 드릴 수 없어요. 잠시 후 다시 시도해주세요.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* 상단 헤더 */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-amber-400/40 bg-white overflow-hidden">
              <img
                src={catSrc}
                alt="밥토리 캐릭터"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-lg font-bold">밥토리</h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 채팅 내용 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-50/40 to-purple-50/40">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="flex items-end gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-amber-400/40 bg-white overflow-hidden">
                    <img
                      src={catSrc}
                      alt="밥토리 캐릭터"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-3 py-2 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 mb-1">밥토리</p>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )}
              {msg.sender === "user" && (
                <div className="flex flex-col items-end gap-1 max-w-[80%]">
                  <div className="bg-sky-500 text-white px-3 py-2 rounded-2xl rounded-br-none shadow-sm">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.timestamp && (
                    <span className="text-[10px] text-gray-400 mr-1">{msg.timestamp}</span>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* 로딩 중 말풍선 (… 깜빡이는 점) */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-amber-400/40 bg-white overflow-hidden">
                <img
                src={catSrc}
                alt="밥토리 캐릭터"
                className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-2 bg-white border border-gray-200 rounded-2xl rounded-tl-none px-3 py-2 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <form onSubmit={handleSubmit} className="border-t p-3 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="밥토리에게 말 걸기..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 transition-colors shadow-sm active:scale-95 disabled:bg-sky-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}