import MainScreen from "./pages/MainScreen"
import RecommendationScreen from "./pages/RecommendationScreen"
import UploadScreen from "./pages/UploadScreen"
import DiaryScreen from "./pages/DiaryScreen"
import PlacesScreen from "./pages/PlacesScreen"
import ChatbotScreen from "./pages/ChatbotScreen"
import Navigation from "./components/Navigation"

export default function App() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-24">
      <main className="max-w-2xl mx-auto">
        <section id="home">
          <MainScreen onRecommend={() => scrollToSection("recommend")} />
        </section>

        <section id="recommend" className="border-t border-gray-200/50">
          <RecommendationScreen onBack={() => scrollToSection("home")} />
        </section>

        <section id="upload" className="border-t border-gray-200/50">
          <UploadScreen onBack={() => scrollToSection("home")} />
        </section>

        <section id="diary" className="border-t border-gray-200/50">
          <DiaryScreen onBack={() => scrollToSection("home")} />
        </section>

        <section id="places" className="border-t border-gray-200/50">
          <PlacesScreen onBack={() => scrollToSection("home")} />
        </section>

        <section id="chat" className="border-t border-gray-200/50">
          <ChatbotScreen onBack={() => scrollToSection("home")} />
        </section>
      </main>
      <Navigation onNavigate={scrollToSection} />
    </div>
  )
}
