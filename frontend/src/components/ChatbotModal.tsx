"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Bot } from "lucide-react"
import { api } from "../lib/api"

interface ChatbotModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  sender: "user" | "bot"
  text: string
}

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 모달이 열릴 때마다 새로운 세션을 시작하고, 초기 메시지를 설정합니다.
  useEffect(() => {
    if (isOpen) {
      setSessionId(`session_${Date.now()}`)
      setMessages([
        {
          sender: "bot",
          text: "안녕하세요! 오늘 어떤 음식이 땡기시나요?",
        },
      ])
      setInput("")
    }
  }, [isOpen])

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동시킵니다.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // 스트리밍 응답을 위해 fetch API 사용
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

      // 봇 메시지를 먼저 생성하고, 스트리밍 데이터를 추가합니다.
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[70vh] flex flex-col">
        {/* 헤더 */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-sky-600" />
            <h3 className="font-bold text-lg">밥토리 AI 챗봇</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  msg.sender === "user"
                    ? "bg-sky-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-xl rounded-bl-none">
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

        {/* 입력창 */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}