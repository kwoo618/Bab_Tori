import { useState, useEffect } from "react"

const DEFAULT_LOCATION = {
  lat: 35.8714, // 대구 위도
  lon: 128.6014, // 대구 경도
}

export function useGeolocation() {
  const [location, setLocation] = useState<{
    lat: number
    lon: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("현재 브라우저에서는 위치 정보를 지원하지 않습니다.")
      setLocation(DEFAULT_LOCATION)
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`)
        setError("위치 정보를 가져올 수 없습니다. 기본 위치로 표시합니다.")
        setLocation(DEFAULT_LOCATION)
        setLoading(false)
      },
      {
        enableHighAccuracy: true, // 더 정확한 위치 요청
        timeout: 10000, // 10초 타임아웃
        maximumAge: 0, // 캐시 사용 안함
      },
    ) // 컴포넌트 마운트 시 한 번만 실행
  }, []) // 컴포넌트 마운트 시 한 번만 실행

  return { location, error, loading }
}