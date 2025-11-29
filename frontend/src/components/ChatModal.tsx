"use client"

import { X, Send } from "lucide-react"

export default function ChatModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md h-[80vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-300 rounded-full flex items-center justify-center text-lg shadow-sm">
              😋
            </div>
            <h2 className="text-lg font-bold">밥토리</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow p-4 overflow-y-auto bg-gray-50/50 chat-box">
          <div className="space-y-4">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 bg-amber-300 rounded-full flex items-center justify-center text-lg flex-shrink-0 border border-amber-400/30">
                😋
              </div>
              <div className="flex flex-col gap-1 max-w-[80%]">
                <span className="text-xs text-gray-500 ml-1">밥토리</span>
                <div className="p-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-800 leading-relaxed">
                  <p>
                    다른 추천이 필요해? <br />
                    매콤한 거나, 느끼한 거 어때?
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-row-reverse items-start gap-2.5">
              <div className="flex flex-col gap-1 items-end max-w-[80%]">
                <div className="p-3 bg-sky-500 text-white rounded-2xl rounded-tr-none shadow-sm text-sm leading-relaxed">
                  <p>매콤한게 땡겨!</p>
                </div>
                <span className="text-xs text-gray-400 mr-1">오후 12:30</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 bg-amber-300 rounded-full flex items-center justify-center text-lg flex-shrink-0 border border-amber-400/30">
                😋
              </div>
              <div className="flex flex-col gap-1 max-w-[80%]">
                <span className="text-xs text-gray-500 ml-1">밥토리</span>
                <div className="p-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-800 leading-relaxed">
                  <p>그럼 짬뽕이나 낙지볶음은 어때? 스트레스가 확 풀릴 거야! 🔥</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-sky-200 transition-all outline-none"
              placeholder="밥토리에게 말 걸기..."
            />
            <button className="bg-sky-500 text-white p-3 rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-sm active:scale-95">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
