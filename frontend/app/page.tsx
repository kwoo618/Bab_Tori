"use client"

import { useState } from "react"
import MainScreen from "@/components/main-screen"
import RecommendationScreen from "@/components/recommendation-screen"
import UploadScreen from "@/components/upload-screen"
import DiaryScreen from "@/components/diary-screen"
import PlacesScreen from "@/components/places-screen"
import ChatbotScreen from "@/components/chatbot-screen"
import Navigation from "@/components/navigation"

type Page = "home" | "recommend" | "upload" | "diary" | "places" | "chat"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("home")

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <main className="flex-1 overflow-auto pb-20">
        {currentPage === "home" && <MainScreen onRecommend={() => setCurrentPage("recommend")} />}
        {currentPage === "recommend" && <RecommendationScreen onBack={() => setCurrentPage("home")} />}
        {currentPage === "upload" && <UploadScreen onBack={() => setCurrentPage("home")} />}
        {currentPage === "diary" && <DiaryScreen onBack={() => setCurrentPage("home")} />}
        {currentPage === "places" && <PlacesScreen onBack={() => setCurrentPage("home")} />}
        {currentPage === "chat" && <ChatbotScreen onBack={() => setCurrentPage("home")} />}
      </main>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}
