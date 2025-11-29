const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(options?.headers ?? {}),
    },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`API 요청 에러: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: request,
  postJson<T>(path: string, body: any) {
    return request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  },
    // ✅ 사진/파일 업로드용
  postForm<T>(path: string, formData: FormData) {
    return request<T>(path, {
      method: "POST",
      body: formData, // Content-Type은 브라우저가 자동으로 설정
    })
  },
}
