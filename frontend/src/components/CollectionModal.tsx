"use client"

import { X, Search } from "lucide-react"

export default function CollectionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>📖</span> 나의 음식 도감 <span className="text-sky-600 text-sm">(3/100)</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {/* Filter/Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="음식 검색..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Collected food items */}
            <CollectionItem name="김치찌개" img="https://placehold.co/150x150/f87171/ffffff?text=김치찌개" />
            <CollectionItem name="해물파전" img="https://placehold.co/150x150/fbbf24/ffffff?text=해물파전" />
            <CollectionItem name="칼국수" img="https://placehold.co/150x150/34d399/ffffff?text=칼국수" />

            {/* Empty items */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center opacity-60"
              >
                <span className="text-2xl mb-1 text-gray-300">?</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CollectionItem({ name, img }: { name: string; img: string }) {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 border border-gray-100 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1">
        <img src={img || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
      </div>
      <p className="font-semibold text-xs text-gray-700">{name}</p>
    </div>
  )
}
