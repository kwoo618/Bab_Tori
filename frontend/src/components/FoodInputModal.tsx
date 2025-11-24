"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"

interface FoodInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FoodInputData) => void
}

export interface FoodInputData {
  foodName: string
  category: string
  memo?: string
}

const CATEGORIES = ["한식", "일식", "양식", "중식", "한우/소고기", "카페/간식", "기타"]

export default function FoodInputModal({ isOpen, onClose, onSubmit }: FoodInputModalProps) {
  const [foodName, setFoodName] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [memo, setMemo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!foodName.trim()) {
      alert("음식 이름을 입력해주세요")
      return
    }
    onSubmit({
      foodName: foodName.trim(),
      category,
      memo: memo.trim() || undefined,
    })
    setFoodName("")
    setCategory(CATEGORIES[0])
    setMemo("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end">
      <div className="w-full bg-white rounded-t-2xl p-6 max-w-2xl mx-auto animate-in slide-in-from-bottom">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">음식 기록하기</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">음식 이름 *</label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="예: 떡볶이, 된장찌개"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">메모 (선택사항)</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="음식에 대한 느낌이나 메모를 남겨보세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              다음 (사진 인증)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
