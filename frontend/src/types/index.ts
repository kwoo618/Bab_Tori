export interface WeatherData {
  location: string
  temp: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
}

export interface Character {
  id: string
  level: number
  satiety: number
  friendship: number
  exp: number
  nextLevelExp: number
}

export interface Food {
  id?: string // 백엔드에서 id를 보내주지 않으므로 optional로 변경
  name: string
  category: string
  ingredients?: string
  imageUrl?: string // ✅ imageUrl 추가
  description?: string
  reason?: string
  type?: string
  emoji: string
  isRecommended: boolean
}

export interface FoodRecord {
  id: string
  food: Food
  photoUrl?: string
  timestamp: Date
  satietyGain: number
  expGain: number
  friendshipGain: number
}

export interface WeatherData {
  temp: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
}

export interface Place {
  id: string
  name: string
  category: string
  lat: number
  lng: number
  rating: number
  distance: string
  address: string
}
