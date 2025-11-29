"use client"

import { useEffect, useRef, useState } from "react"
import type { Place } from "../hooks/usePlaces"

interface KakaoMapProps {
  center: { lat: number; lon: number }
  places: Place[]
  selectedPlace?: Place | null
}
declare global {
  interface Window {
    kakao: any
  }
}
export default function KakaoMap({ center, places, selectedPlace }: KakaoMapProps) {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null) // ✅ 지도 컨테이너를 위한 ref
  const [markers, setMarkers] = useState<any[]>([])
  const [currentLocationMarker, setCurrentLocationMarker] = useState<any>(null)
  
  useEffect(() => {
    if (typeof window === "undefined") return

    const KAKAO_MAP_SCRIPT_ID = "kakao-map-sdk"
    const KAKAO_MAP_APP_KEY = import.meta.env.VITE_KAKAO_MAP_JS_KEY

    // 스크립트가 이미 로드되었는지 확인
    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID)

    if (!existingScript) {
      // 스크립트가 없으면 새로 생성하여 추가
      const script = document.createElement("script")
      script.id = KAKAO_MAP_SCRIPT_ID
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false`
      script.async = true
      script.onerror = () => console.error("Kakao map script load error")
      document.head.appendChild(script)

      script.onload = () => {
        window.kakao.maps.load(initMap)
      }
    } else if (window.kakao && window.kakao.maps) {
      // 스크립트가 이미 로드되었지만, 안전하게 load 함수를 통해 지도 생성
      window.kakao.maps.load(initMap)
    }

    function initMap() {
      if (!containerRef.current) return

      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lon),
        level: 4,
      }

      // 지도가 이미 생성되었다면 중심 위치만 이동, 아니면 새로 생성
      if (mapRef.current) {
        mapRef.current.setCenter(options.center)
      } else if (containerRef.current) {
        mapRef.current = new window.kakao.maps.Map(containerRef.current, options)
      }
    }

  }, []) // ✅ 스크립트 로딩 및 최초 지도 생성은 한 번만 실행

  // center prop이 변경될 때마다 지도의 중심을 업데이트하고 현재 위치 마커를 표시
  useEffect(() => { 
    // 지도 인스턴스가 생성된 후에만 아래 로직 실행
    if (!mapRef.current || !window.kakao) return

    const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lon)
    mapRef.current.setCenter(moveLatLon)

    // 현재 위치 마커 생성
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png' 
    const imageSize = new window.kakao.maps.Size(64, 69)
    const imageOption = {offset: new window.kakao.maps.Point(27, 69)}
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

    // 기존 마커가 있으면 위치만 이동, 없으면 새로 생성
    if (currentLocationMarker) {
      currentLocationMarker.setPosition(moveLatLon)
    } else {
      const marker = new window.kakao.maps.Marker({ position: moveLatLon, image: markerImage })
      marker.setMap(mapRef.current)
      setCurrentLocationMarker(marker)
    }
  }, [center.lat, center.lon])

  // places가 변경될 때 마커를 업데이트하는 useEffect
  useEffect(() => {
    // 지도와 places 데이터가 모두 준비되었을 때만 마커를 그립니다.
    if (!mapRef.current || !window.kakao || !places || places.length === 0) return

    // 1. 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null))

    // 2. 새로운 마커 추가
    const normalImageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"
    const selectedImageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_flutter.png"
    const imageSize = new window.kakao.maps.Size(24, 35)

    const normalMarkerImage = new window.kakao.maps.MarkerImage(normalImageSrc, imageSize)
    const selectedMarkerImage = new window.kakao.maps.MarkerImage(selectedImageSrc, imageSize)

    const newMarkers = places.map((p) => {
      const isSelected = p.id === selectedPlace?.id
      const pos = new window.kakao.maps.LatLng(Number(p.y), Number(p.x))
      const marker = new window.kakao.maps.Marker({
        position: pos,
        image: isSelected ? selectedMarkerImage : normalMarkerImage,
      })
      marker.setMap(mapRef.current)
      return marker
    })
    setMarkers(newMarkers)
  }, [places, selectedPlace]) // ✅ selectedPlace가 바뀔 때도 마커를 다시 그림

  return (
    <div
      ref={containerRef} // ✅ ref를 div에 연결
      className="w-full h-64 rounded-xl border border-gray-300"
    />
  )
}