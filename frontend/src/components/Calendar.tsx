"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarProps {
  markedDates: Date[]
  onDateClick: (date: Date) => void
  selectedDate: Date | null
}

export default function Calendar({ markedDates, onDateClick, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const isMarkedDate = (date: Date) => {
    return markedDates.some((d) => isSameDay(d, date))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-bold text-gray-900">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h3>
        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />
          }

          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          const marked = isMarkedDate(date)
          const isSelected = selectedDate && isSameDay(date, selectedDate)

          return (
            <button
              key={day}
              onClick={() => onDateClick(date)}
              className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                isSelected
                  ? "bg-orange-500 text-white shadow-md scale-105"
                  : marked
                    ? "bg-orange-100 text-orange-900 hover:bg-orange-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span>{day}</span>
                {marked && <span className="text-xs">🍽️</span>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
