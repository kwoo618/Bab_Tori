"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, MessageCircle } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import ChatbotOptions from "@/components/chatbot-options"

interface Message {
  id: string
  sender: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatbotScreenProps {
  onBack: () => void
}

const INITIAL_RESPONSES: Record<string, string> = {
  한식: "한식이 좋아하는군요? 😋",
  중식: "중식도 맛있지요! 🥡",
  일식: "일식은 건강한 선택이에요! 🍣",
  양식: "양식은 특별한 날에 좋아요! 🍽️",
  분식: "분식은 언제나 최고! 🍖",
  고기: "고기 좋아요? 단백질 가득! 🍖",
  면: "면은 맛있으니까요! 🍜",
  국물: "국물은 영혼의 음식이에요! 🥘",
}

export default function ChatbotScreen({ onBack }: ChatbotScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      sender: "bot",
      content: "안녕하세요! 👋 밥토리예요. 뭘 먹고 싶으세요? 추천을 도와드릴게요!",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [showOptions, setShowOptions] = useState(true)
  const [step, setStep] = useState<"category" | "ingredient" | "result">("category")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      let botResponse = ""

      if (step === "category") {
        botResponse = INITIAL_RESPONSES[text] || `${text}도 맛있으니까요! 🤤 이제 어떤 재료가 좋아요?`
        setSelectedCategory(text)
        setStep("ingredient")
      } else if (step === "ingredient") {
        botResponse = `${text}와 ${selectedCategory}의 조합이군요! 멋진데요? 🤩\n그럼 이런 음식들은 어때요?\n• ${selectedCategory} ${text} 덮밥\n• ${text} ${selectedCategory} 볶음\n• ${text} ${selectedCategory} 스튜\n\n이 중에 먹고 싶은 게 있나요?`
        setStep("result")
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        content: botResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 300)
  }

  const handleOptionSelect = (option: string) => {
    handleSendMessage(option)
    setShowOptions(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4 pt-6 h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <MessageCircle size={24} className="text-primary" />
          <h1 className="text-2xl font-bold text-primary">밥토리 챗봇</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* 옵션 표시 */}
        {showOptions && step === "category" && (
          <ChatbotOptions
            title="어떤 음식이 좋아요?"
            options={["한식", "중식", "일식", "양식", "분식", "패스트푸드"]}
            onSelect={handleOptionSelect}
          />
        )}

        {showOptions && step === "ingredient" && (
          <ChatbotOptions
            title="어떤 재료가 좋아요?"
            options={["고기", "면", "국물", "밥", "튀김", "야채"]}
            onSelect={handleOptionSelect}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(inputValue)
            }
          }}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-primary focus:outline-none transition"
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          className="p-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-full transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
