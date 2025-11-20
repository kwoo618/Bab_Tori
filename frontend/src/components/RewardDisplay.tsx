interface RewardDisplayProps {
  reward: {
    food: string
    satiety: number
    friendship: number
    exp: number
    isRecommended: boolean
  }
}

export default function RewardDisplay({ reward }: RewardDisplayProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 animate-bounce">
        <div className="text-6xl mb-4">{reward.isRecommended ? "🥰" : "😐"}</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{reward.food}를 먹었어요!</h2>
        <p className="text-sm text-muted-foreground mb-6">{reward.isRecommended ? "맛있었어!" : "음... 괜찮아"}</p>

        <div className="space-y-3">
          <div className="flex justify-between items-center bg-orange-50 p-3 rounded-lg">
            <span className="font-semibold text-foreground">포만감</span>
            <span className="text-lg font-bold text-primary">+{reward.satiety}</span>
          </div>
          <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
            <span className="font-semibold text-foreground">친밀도</span>
            <span className="text-lg font-bold text-secondary">+{reward.friendship}</span>
          </div>
          <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
            <span className="font-semibold text-foreground">경험치</span>
            <span className="text-lg font-bold text-green-600">+{reward.exp}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
