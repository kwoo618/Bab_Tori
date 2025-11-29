"use client"

interface ChatbotOptionsProps {
  title: string
  options: string[]
  onSelect: (option: string) => void
}

export default function ChatbotOptions({ title, options, onSelect }: ChatbotOptionsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-muted-foreground px-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className="px-3 py-2 bg-gray-100 hover:bg-primary hover:text-white text-foreground rounded-full text-sm font-semibold transition-all hover:scale-105"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
