"use client"

import { Card } from "@/components/ui/card"

interface Message {
  id: string
  sender: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Card
        className={`px-4 py-3 rounded-2xl max-w-xs whitespace-pre-wrap ${
          isUser ? "bg-primary text-white border-0" : "bg-gray-100 text-foreground border-0"
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </Card>
    </div>
  )
}
