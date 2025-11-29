"use client"

import { Home, Utensils, BookOpen } from "lucide-react"

interface NavigationProps {
  onNavigate: (id: string) => void
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const navItems = [
    { id: "home", label: "홈", icon: <Home size={24} /> },
    { id: "recommend", label: "추천", icon: <Utensils size={24} /> },
    { id: "diary", label: "도감", icon: <BookOpen size={24} /> },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-sky-600 transition-colors active:scale-95"
          >
            {item.icon}
            <span className="text-xs mt-1 font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
