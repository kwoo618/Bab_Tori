import { MapPin, Camera } from "lucide-react"

export default function BottomNavigation() {
  return (
    <footer className="w-full max-w-md mx-auto bg-white border-t flex-shrink-0 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-around">
        <button className="flex-1 flex flex-col items-center p-3 text-sm font-semibold text-sky-600 border-t-2 border-sky-600 bg-sky-50/50">
          <MapPin className="w-6 h-6 mb-1" />
          <span>맛집 찾기</span>
        </button>
        <button className="flex-1 flex flex-col items-center p-3 text-sm font-semibold text-gray-400 border-t-2 border-transparent hover:text-gray-600">
          <Camera className="w-6 h-6 mb-1" />
          <span>음식 인증</span>
        </button>
      </nav>
    </footer>
  )
}
