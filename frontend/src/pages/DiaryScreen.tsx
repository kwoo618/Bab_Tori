"use client"

import { useState } from "react"
import { ChevronUp } from "lucide-react"
import Calendar from "../components/Calendar"
import FoodDetailModal from "../components/FoodDetailModal"

interface DiaryScreenProps {
  onBack: () => void
}

const MOCK_FOOD_RECORDS = [
  {
    id: "1",
    date: new Date(2024, 0, 15),
    foods: [
      {
        id: "f1",
        name: "떡볶이",
        category: "한식",
        photoUrl: "/spicy-tteokbokki.png",
        memo: "정말 맛있었어요!",
      },
      {
        id: "f2",
        name: "김밥",
        category: "한식",
        photoUrl: "/colorful-kimbap.png",
      },
    ],
  },
  {
    id: "2",
    date: new Date(2024, 0, 16),
    foods: [
      {
        id: "f3",
        name: "라면",
        category: "한식",
        photoUrl: "/steaming-bowl-of-ramen.png",
        memo: "야식으로 먹음",
      },
    ],
  },
  {
    id: "3",
    date: new Date(2024, 0, 18),
    foods: [
      {
        id: "f4",
        name: "초밥",
        category: "일식",
        photoUrl: "/assorted-sushi-platter.png",
      },
    ],
  },
]

export default function DiaryScreen({ onBack }: DiaryScreenProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedFood, setSelectedFood] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const markedDates = MOCK_FOOD_RECORDS.map((r) => r.date)
  const selectedDayRecords = selectedDate
    ? MOCK_FOOD_RECORDS.find(
        (r) =>
          r.date.getFullYear() === selectedDate.getFullYear() &&
          r.date.getMonth() === selectedDate.getMonth() &&
          r.date.getDate() === selectedDate.getDate(),
      )?.foods || []
    : []

  const handleFoodClick = (food: any) => {
    setSelectedFood({
      ...food,
      date: selectedDate?.toLocaleDateString("ko-KR"),
    })
    setIsDetailOpen(true)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">음식 도감</h1>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronUp size={24} />
        </button>
      </div>

      {/* 캘린더 */}
      <Calendar markedDates={markedDates} onDateClick={setSelectedDate} selectedDate={selectedDate} />

      {/* 선택된 날짜의 음식 목록 */}
      {selectedDate && (
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="font-bold text-gray-900 mb-4">{selectedDate.toLocaleDateString("ko-KR")} 기록</h2>

          {selectedDayRecords.length > 0 ? (
            <div className="space-y-3">
              {selectedDayRecords.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleFoodClick(food)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  {food.photoUrl && (
                    <img
                      src={food.photoUrl || "/placeholder.svg"}
                      alt={food.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{food.name}</p>
                    <p className="text-xs text-gray-600">{food.category}</p>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">이 날짜에 기록된 음식이 없습니다.</p>
          )}
        </div>
      )}

      {/* 음식 상세 모달 */}
      <FoodDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} food={selectedFood} />
    </div>
  )
}
