/**
 * API 封装：统一 fetch / 错误处理 / 演示身份。
 * 身份方案（登录模块上线前的过渡）：后端首次在 /api/me/profile 返回用户 id，
 * 前端持久化到 localStorage，后续请求通过 X-User-Id 头携带。
 */
const BASE = '/api'
const UID_KEY = 'filmisle_uid'

import type { MyRating, MyFavorite } from './types'

export function getUserId(): number | null {
  const raw = localStorage.getItem(UID_KEY)
  const id = raw ? Number(raw) : NaN
  return Number.isFinite(id) ? id : null
}

export function setUserId(id: number) {
  localStorage.setItem(UID_KEY, String(id))
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...((init?.headers as Record<string, string>) ?? {}),
  }
  if (init?.body) headers['Content-Type'] = 'application/json'
  const uid = getUserId()
  if (uid) headers['X-User-Id'] = String(uid)

  const res = await fetch(BASE + path, { ...init, headers })
  if (!res.ok) {
    let message = `请求失败（${res.status}）`
    try {
      const body = await res.json()
      if (body?.message) message = body.message
    } catch {
      /* 非 JSON 错误体 */
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

const json = (body: unknown) => JSON.stringify(body)

export const api = {
  /** 会话建立 + 档案（首次调用会把后端返回的用户 id 存入 localStorage） */
  profile: async () => {
    const p = await request<MeProfile>('/me/profile')
    setUserId(p.id)
    return p
  },
  interaction: (movieId: number) => request<InteractionState>(`/me/interaction/${movieId}`),
  myRatings: () => request<MyRating[]>('/me/ratings'),
  myFavorites: () => request<MyFavorite[]>('/me/favorites'),
  rate: (movieId: number, score: number) =>
    request<RatingResult>(`/movies/${movieId}/ratings`, { method: 'POST', body: json({ score }) }),
  setFavorite: (movieId: number, on: boolean) =>
    request<FavoriteResult>(`/movies/${movieId}/favorite`, { method: on ? 'POST' : 'DELETE' }),
  recommendations: () => request<RecommendationResponse>('/recommendations'),
}

// ---------- 响应类型（与后端 DTO 对齐） ----------

export interface MeProfile {
  id: number
  nickname: string
  email: string
  role: 'USER' | 'ADMIN'
  joinedAt: string
  ratedCount: number
  favoriteCount: number
  topTags: string[]
}

export interface InteractionState {
  movieId: number
  myScore: number | null
  favorited: boolean
}

export interface RatingResult {
  movieId: number
  score: number
  ratedAt: string
  movieRating: number | null
  movieRatingCount: number | null
}

export interface FavoriteResult {
  movieId: number
  favorited: boolean
  favoritedAt: string | null
}

export interface RecommendationItem {
  movieId: number
  title: string
  posterUrl: string
  year: number
  region: string
  rating: number
  tags: string[]
  /** 0-1 归一化推荐分 */
  score: number
  reason: string
  matchedTags: string[]
  strategy: 'tag' | 'hot' | 'cold-start'
}

export interface RecommendationResponse {
  items: RecommendationItem[]
  summary: {
    topTags: string[]
    ratedCount: number
    favoriteCount: number
  }
}
