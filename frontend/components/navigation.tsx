"use client"

import { Home, Utensils, Upload, Book, Map, MessageCircle } from "lucide-react"

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: "home", icon: Home, label: "홈" },
    { id: "recommend", icon: Utensils, label: "추천" },
    { id: "upload", icon: Upload, label: "인증" },
    { id: "diary", icon: Book, label: "도감" },
    { id: "places", icon: Map, label: "맛집" },
    { id: "chat", icon: MessageCircle, label: "챗봇" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                currentPage === id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
