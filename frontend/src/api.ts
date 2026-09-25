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
  if (res.status === 204) {
    return undefined as T
  }
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
  /** 推荐位点击上报（幂等：同人同片每天只计一次），fire-and-forget 调用 */
  reportRecoClick: (movieId: number) =>
    request<void>(`/recommendations/${movieId}/click`, { method: 'POST' }),

  // ---------- 管理后台 ----------
  /** 后台全部统计指标（数据看板 + 推荐概览共用） */
  adminStats: () => request<AdminStats>('/admin/stats'),
  /** 公开站点概览（游客可访问，首页 Hero 用） */
  publicOverview: () => request<PublicOverview>('/stats/overview'),
  /** 电影列表（管理页与前台共用，kw/tag/分页/排序由后端处理） */
  movieList: (params: { kw?: string; tag?: string; page?: number; pageSize?: number; sort?: string }) => {
    const qs = new URLSearchParams()
    if (params.kw) qs.set('kw', params.kw)
    if (params.tag) qs.set('tag', params.tag)
    qs.set('page', String(params.page ?? 1))
    qs.set('pageSize', String(params.pageSize ?? 12))
    if (params.sort) qs.set('sort', params.sort)
    return request<MovieListResponse>(`/movies?${qs.toString()}`)
  },
  allTags: () => request<string[]>('/tags'),
  createMovie: (body: MoviePayload) =>
    request<MoviePayloadResult>('/admin/movies', { method: 'POST', body: json(body) }),
  updateMovie: (movieId: number, body: MoviePayload) =>
    request<MoviePayloadResult>(`/admin/movies/${movieId}`, { method: 'PATCH', body: json(body) }),
  deleteMovie: (movieId: number) =>
    request<void>(`/admin/movies/${movieId}`, { method: 'DELETE' }),
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

// ---------- 管理后台类型 ----------

/** 电影条目（对齐后端 MovieResponse，createdAt 为 ISO 字符串） */
export interface MovieItem {
  id: number
  title: string
  originalTitle: string
  year: number
  duration: number
  director: string
  cast: string[]
  region: string
  summary: string
  tags: string[]
  rating: number | null
  ratingCount: number | null
  posterUrl: string
  createdAt: string
}

export interface MovieListResponse {
  items: MovieItem[]
  total: number
  page: number
  pageSize: number
}

/** 电影新增 / 编辑请求体（对齐后端 MovieRequest） */
export interface MoviePayload {
  title: string
  originalTitle?: string
  year?: number
  duration?: number
  director?: string
  /** 主演，用 / 或逗号分隔 */
  cast?: string
  region?: string
  summary?: string
  tags?: string[]
  posterUrl?: string
}

export type MoviePayloadResult = MovieItem

/** 后台统计（对齐后端 AdminStatsResponse，PRD 6.1 指标） */
export interface AdminStats {
  movieCount: number
  userCount: number
  ratingCount: number
  todayRatingCount: number
  favoriteCount: number
  /** 收藏率：收藏过至少一部的用户占比（%） */
  favoriteRate: number
  recoTotalCount: number
  todayRecoCount: number
  avgResultCount: number
  /** 推荐点击率：累计点击 / 累计推荐展示条数（%） */
  recoCtr: number
  recoClickCount: number
  coldStartRate: number
  weeklyRatings: { day: string; count: number }[]
  strategyDist: { strategy: string; count: number; percent: number }[]
  hotTags: { tag: string; count: number }[]
  recentLogs: {
    id: number
    userId: number
    userName: string
    strategy: string
    resultCount: number
    time: string
  }[]
}

/** 公开站点概览（对齐后端 PublicOverviewResponse，游客可访问） */
export interface PublicOverview {
  movieCount: number
  userCount: number
  todayRatingCount: number
  recoCtr: number
}
