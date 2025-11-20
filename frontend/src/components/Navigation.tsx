"use client"
import { Home, Utensils, Camera, BookOpen, MapPin, MessageCircle } from "lucide-react"

interface NavigationProps {
  onNavigate: (id: string) => void
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const navItems = [
    { id: "home", label: "홈", icon: <Home size={24} /> },
    { id: "recommend", label: "추천", icon: <Utensils size={24} /> },
    { id: "upload", label: "인증", icon: <Camera size={24} /> },
    { id: "diary", label: "도감", icon: <BookOpen size={24} /> },
    { id: "places", label: "맛집", icon: <MapPin size={24} /> },
    { id: "chat", label: "챗봇", icon: <MessageCircle size={24} /> },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-20 max-w-2xl mx-auto px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-primary transition-colors active:scale-95"
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
