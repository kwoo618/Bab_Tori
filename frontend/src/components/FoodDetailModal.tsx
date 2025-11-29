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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between bg-white p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{food.name}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {food.photoUrl && (
            <img
              src={food.photoUrl || "/placeholder.svg"}
              alt={food.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">음식 이름</p>
              <p className="font-semibold text-gray-900">{food.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">카테고리</p>
              <p className="font-semibold text-gray-900">{food.category}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">먹은 날짜</p>
              <p className="font-semibold text-gray-900">{food.date}</p>
            </div>

            {food.memo && (
              <div>
                <p className="text-sm text-gray-600">메모</p>
                <p className="text-gray-900 text-sm leading-relaxed">{food.memo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
