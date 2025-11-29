"use client"
import { X } from "lucide-react"

interface FoodDetailModalProps {
  isOpen: boolean
  onClose: () => void
  food: {
    id: string
    name: string
    category: string
    photoUrl?: string
    memo?: string
    date: string
  } | null
}

export default function FoodDetailModal({ isOpen, onClose, food }: FoodDetailModalProps) {
  if (!isOpen || !food) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">{food.name}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* ✅ 사진 영역: 사진이 있을 때만 렌더링 */}
          {food.photoUrl && (
            <div className="w-full">
              <img
                src={food.photoUrl}
                alt={food.name}
                className="w-full h-56 object-cover rounded-2xl border border-gray-100"
              />
            </div>
          )}

          {/* 기존 텍스트 정보들 */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400">음식 이름</p>
              <p className="text-sm font-semibold text-gray-900">{food.name}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">카테고리</p>
              <p className="text-sm font-semibold text-gray-900">{food.category}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">먹은 날짜</p>
              <p className="text-sm font-semibold text-gray-900">{food.date}</p>
            </div>

            {food.memo && (
              <div>
                <p className="text-xs text-gray-400">메모</p>
                <p className="text-sm leading-relaxed text-gray-900">{food.memo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}