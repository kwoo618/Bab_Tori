"use client"

// 일부 레이아웃/카테고리 필터 디자인은
// Flavoriz(https://github.com/Suv05/Flavoriz)의 Recipes / Vegan 컴포넌트를 참고했습니다.

import { useState, useMemo } from "react"
import { ChevronUp } from "lucide-react"
import Calendar from "../components/Calendar"
import FoodDetailModal from "../components/FoodDetailModal"
import { useFoodRecords } from "../hooks/useFoodRecords"

interface DiaryScreenProps {
  onBack: () => void
}

const CATEGORIES = ["전체", "한식", "중식", "일식", "양식", "분식", "야식", "기타"] as const
type Category = (typeof CATEGORIES)[number]

interface FoodRecordItem {
  id: string
  name: string
  category: Category | string
  photoUrl?: string
  memo?: string
}

interface FoodRecord {
  id: string
  date: Date
  foods: FoodRecordItem[]
}

// 예전 MOCK_FOOD_RECORDS는 이제 사용 안 함 (백엔드에서 가져옴)

export default function DiaryScreen({ onBack }: DiaryScreenProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedFood, setSelectedFood] = useState<{
    id: string
    name: string
    category: string
    photoUrl?: string
    memo?: string
    date: string
  } | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | "전체">("전체")

  // ✅ 서버에서 가져온 원본 기록 (useFoodRecords 훅)
  const { records: rawRecords, loading, error } = useFoodRecords()

  // ✅ rawRecords(FoodRecord 타입: food, timestamp 포함) → 이 화면에서 쓰는 형태로 변환
  const diaryRecords: FoodRecord[] = useMemo(() => {
    const map = new Map<string, FoodRecord>()

    rawRecords.forEach((r) => {
      const d = r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

      let rec = map.get(key)
      if (!rec) {
        rec = {
          id: key,
          date: d,
          foods: [],
        }
        map.set(key, rec)
      }

      rec.foods.push({
        id: r.id,
        name: r.food.name,
        category: r.food.category,
        photoUrl: r.photoUrl,
      })
    })

    // 날짜 내림차순 정렬 (최근 먹은 날이 위로)
    return Array.from(map.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    )
  }, [rawRecords])

  // 캘린더에 표시할 날짜들
  const markedDates = useMemo(
    () => diaryRecords.map((r) => r.date),
    [diaryRecords],
  )

  // 선택된 날짜의 기록
  const selectedDayFoods: FoodRecordItem[] = useMemo(() => {
    if (!selectedDate) return []
    const record = diaryRecords.find(
      (r) =>
        r.date.getFullYear() === selectedDate.getFullYear() &&
        r.date.getMonth() === selectedDate.getMonth() &&
        r.date.getDate() === selectedDate.getDate(),
    )
    return record?.foods ?? []
  }, [selectedDate, diaryRecords])

  // 카테고리 필터 적용
  const filteredFoods = useMemo(
    () =>
      selectedCategory === "전체"
        ? selectedDayFoods
        : selectedDayFoods.filter((food) => food.category === selectedCategory),
    [selectedCategory, selectedDayFoods],
  )

  const handleFoodClick = (food: FoodRecordItem) => {
    setSelectedFood({
      ...food,
      date: selectedDate?.toLocaleDateString("ko-KR") ?? "",
    })
    setIsDetailOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100">
      <div className="max-w-2xl mx-auto p-4 pb-10 space-y-6">
        {/* 상단 헤더 */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-orange-500 uppercase tracking-wide">
              Babtori Diary
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              오늘은{" "}
              <span className="text-orange-500 underline underline-offset-4">
                무엇을
              </span>{" "}
              먹었나요?
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              캘린더에서 날짜를 선택하고, 먹은 음식을 카드로 모아보세요.
            </p>
          </div>
          <button
            onClick={onBack}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronUp size={24} />
          </button>
        </header>

        {/* 로딩/에러 표시 */}
        {loading && (
          <p className="text-center text-xs text-gray-400">
            음식 기록을 불러오는 중이에요...
          </p>
        )}
        {error && (
          <p className="text-center text-xs text-red-500">{error}</p>
        )}

        {/* 캘린더 카드 */}
        <section className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-orange-100">
          <h2 className="mb-3 text-sm font-semibold text-gray-800">
            기록 캘린더
          </h2>
          <Calendar
            markedDates={markedDates}
            onDateClick={setSelectedDate}
            selectedDate={selectedDate}
          />
        </section>

        {/* 선택한 날짜가 있을 때만 아래 섹션 표시 */}
        {selectedDate && (
          <section className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
            {/* 날짜 타이틀 */}
            <div className="flex items-center justify_between">
              <div>
                <p className="text-xs font-medium text-gray-400">선택된 날짜</p>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedDate.toLocaleDateString("ko-KR")} 기록
                </h2>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>총 {selectedDayFoods.length}개</p>
                {selectedCategory !== "전체" && (
                  <p className="text-orange-500 font-medium">
                    {selectedCategory} {filteredFoods.length}개
                  </p>
                )}
              </div>
            </div>

            {/* 카테고리 필터 바 */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition
                      ${
                        isActive
                          ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            {/* 음식 카드 그리드 */}
            {filteredFoods.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => handleFoodClick(food)}
                    className="relative bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-transform text-left"
                  >
                    {food.photoUrl && (
                      <div className="mb-2">
                        <img
                          src={food.photoUrl || "/placeholder.svg"}
                          alt={food.name}
                          className="w-full h-24 object-cover rounded-xl"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col gap-1">
                      <p className="text-xs font-medium text-orange-500">
                        {food.category}
                      </p>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                        {food.name}
                      </h3>
                      {food.memo && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {food.memo}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 py-6">
                선택한 날짜에{" "}
                {selectedCategory === "전체"
                  ? "기록된 음식이 없습니다."
                  : `${selectedCategory} 기록이 없습니다.`}
              </p>
            )}
          </section>
        )}

        {!selectedDate && (
          <p className="text-center text-sm text-gray-400 pt-4">
            먼저 위 캘린더에서 날짜를 선택해 주세요.
          </p>
        )}
      </div>

      {/* 음식 상세 모달 */}
      <FoodDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        food={selectedFood}
      />
    </div>
  )
}