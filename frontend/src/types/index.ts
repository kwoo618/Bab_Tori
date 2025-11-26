export interface WeatherData {
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
  id: string
  name: string
  category: string
  emoji: string
  isRecommended: boolean
  description: string
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
