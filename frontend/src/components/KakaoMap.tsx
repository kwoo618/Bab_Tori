"use client"

import { useEffect } from "react"
import type { Place } from "../hooks/usePlaces"

interface KakaoMapProps {
  center: { lat: number; lon: number }
  places: Place[]
}

export default function KakaoMap({ center, places }: KakaoMapProps) {
  useEffect(() => {
    if (typeof window === "undefined") return

    console.log("KAKAO JS KEY:", import.meta.env.VITE_KAKAO_MAP_JS_KEY)

    const loadKakaoScript = () =>
      new Promise<void>((resolve, reject) => {
        // 이미 kakao.maps 가 있으면 바로 resolve
        if (window.kakao && window.kakao.maps) {
          resolve()
          return
        }

        // 이미 script 태그가 있으면, load 이벤트만 기다림
        const existingScript = document.getElementById("kakao-map-sdk") as
          | HTMLScriptElement
          | null

        if (existingScript) {
          existingScript.addEventListener("load", () => {
            resolve()
          })
          return
        }

        // 새로 script 추가
        const script = document.createElement("script")
        script.id = "kakao-map-sdk"
        script.src = `http://dapi.kakao.com/v2/maps/sdk.js?appkey=${
          import.meta.env.VITE_KAKAO_MAP_JS_KEY
        }&autoload=false`
        script.async = true
        script.onload = () => resolve()
        script.onerror = (err) => {
          console.error("Kakao map script load error", err)
          reject(err)
        }
        document.head.appendChild(script)
      })

    const initMap = async () => {
      try {
        await loadKakaoScript()

        // 여기서 한 번 더 방어
        if (!window.kakao || !window.kakao.maps) {
          console.error("Kakao SDK is not available on window")
          return
        }

        window.kakao.maps.load(() => {
          const container = document.getElementById("babtori-map")
          if (!container) return

          const options = {
            center: new window.kakao.maps.LatLng(center.lat, center.lon),
            level: 4,
          }

          const map = new window.kakao.maps.Map(container, options)

          // 마커 찍기
          places.forEach((p) => {
            const pos = new window.kakao.maps.LatLng(p.lat, p.lon)
            const marker = new window.kakao.maps.Marker({
              position: pos,
            })
            marker.setMap(map)
          })
        })
      } catch (e) {
        console.error("Failed to init Kakao map", e)
      }
    }

    initMap()
  }, [center.lat, center.lon, places])

  return (
    <div
      id="babtori-map"
      className="w-full h-64 rounded-xl border border-gray-300"
    />
  )
}