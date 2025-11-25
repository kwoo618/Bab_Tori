"use client"

import { useState } from "react"
import Header from "./components/Header"
import CharacterSection from "./components/CharacterSection"
import RecommendationSection from "./components/RecommendationSection"
import InteractionSection from "./components/InteractionSection"
import BottomNavigation from "./components/BottomNavigation"
import CollectionModal from "./components/CollectionModal"
import ChatModal from "./components/ChatModal"
import DiaryScreen from "./pages/DiaryScreen"
import Navigation from "./components/Navigation"
import FoodInputModal, { type FoodInputData } from "./components/FoodInputModal"
import UploadScreen from "./pages/UploadScreen"

export default function App() {
  const [showCharacter, setShowCharacter] = useState(true)
  const [showRecommendation, setShowRecommendation] = useState(true)
  const [showInteraction, setShowInteraction] = useState(false)
  const [showBottomNav, setShowBottomNav] = useState(false)
  const [selectedFood, setSelectedFood] = useState("")

  const [showCollection, setShowCollection] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const [status, setStatus] = useState({
    hunger: 80,
    happiness: 60,
    fatigue: 30,
    friendship: 75,
  })
  const [message, setMessage] = useState("오늘 뭐 먹을지 고민이야?")
  const [emoji, setEmoji] = useState("😋")

  const handleFoodSelect = (foodName: string) => {
    setSelectedFood(foodName)
    setMessage(`${foodName} 좋아! 맛있게 먹어!`)
    setEmoji("🥰")

    // 상태 업데이트
    setStatus((prev) => ({
      hunger: Math.max(0, prev.hunger - 30),
      happiness: Math.min(100, prev.happiness + 20),
      fatigue: Math.max(0, prev.fatigue - 10),
      friendship: prev.friendship,
    }))

    // 섹션 전환
    setShowCharacter(false)
    setShowRecommendation(false)
    setShowInteraction(true)
    setShowBottomNav(true)
  }
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false)
  const [showUploadScreen, setShowUploadScreen] = useState(false) // 사진 인증 화면
  const [foodFormData, setFoodFormData] = useState<FoodInputData | null>(null) // (선택 사항: 나중에 활용)

  const handleFoodSubmit = (data: FoodInputData) => {
  // 1) 폼에 적은 내용 잠깐 저장 (나중에 UploadScreen에서 활용할 수 있음)
  setFoodFormData(data)

  // 2) 음식 기록하기 모달 닫기
  setIsFoodModalOpen(false)

  // 3) 사진 인증 화면 열기
  setShowUploadScreen(true)
  }
  const handleBack = () => {
    setShowCharacter(true)
    setShowRecommendation(true)
    setShowInteraction(false)
    setShowBottomNav(false)
    setMessage("오늘 뭐 먹을지 고민이야?")
    setEmoji("😋")
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="app-container bg-white shadow-xl">
      <Header />

      <main className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-6">
          <section id="home">
            {showCharacter && (
              <CharacterSection
                status={status}
                message={message}
                emoji={emoji}
                onOpenCollection={() => setShowCollection(true)}
              />
            )}

            {showRecommendation && (
              <RecommendationSection onFoodSelect={handleFoodSelect} onOpenChat={() => setShowChat(true)} onOpenFoodModal={() => setIsFoodModalOpen(true)} />
            )}

            {showInteraction && <InteractionSection selectedFood={selectedFood} onBack={handleBack} />}
          </section>
          <section id="diary" className="mt-8">
            <DiaryScreen onBack={() => scrollToSection("home")} />
          </section>
        </div>
      </main>

      {showBottomNav && <BottomNavigation />}

      {showCollection && <CollectionModal onClose={() => setShowCollection(false)} />}

      {showChat && <ChatModal onClose={() => setShowChat(false)} />}

      <FoodInputModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onSubmit={handleFoodSubmit}
      />

      {showUploadScreen && (
        <div className="fixed inset-0 bg-white z-[60] overflow-y-auto">
          <UploadScreen onBack={() => setShowUploadScreen(false)} />
        </div>
      )}
      <Navigation onNavigate={scrollToSection} />
    </div>
  )
}
