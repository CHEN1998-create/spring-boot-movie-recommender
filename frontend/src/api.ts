/**
 * API 封装：统一 fetch / 错误处理 / JWT 会话。
 * 身份方案：登录后 JWT 存 localStorage（filmisle_token），请求带 Authorization: Bearer；
 * 无 token 的浏览类请求由后端回落演示身份。401 统一清除会话并跳转登录页。
 */
const BASE = '/api'
const TOKEN_KEY = 'filmisle_token'
const USER_KEY = 'filmisle_user'

import type { MyRating, MyFavorite } from './types'

export interface SessionUser {
  id: number
  email: string
  nickname: string
  role: 'USER' | 'ADMIN'
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getSessionUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export function setSession(token: string, user: SessionUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/** 会话失效时的统一出口：清会话 → 跳登录页（带回跳地址） */
function expireToLogin() {
  clearSession()
  const next = encodeURIComponent(window.location.pathname + window.location.search)
  window.location.href = `/login?next=${next}`
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...((init?.headers as Record<string, string>) ?? {}),
  }
  if (init?.body) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(BASE + path, { ...init, headers })
  if (res.status === 204) {
    return undefined as T
  }
  // 登录态失效（token 过期 / 用户被删）：清会话并去登录页重新建立
  if (res.status === 401) {
    expireToLogin()
    throw new Error('登录已失效，请重新登录')
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
  // ---------- 认证 ----------
  register: (body: { email: string; password: string; nickname: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: json(body) }),
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: json(body) }),
  /** 用 token 换当前身份（后台顶栏等处校验登录态） */
  authMe: () => request<SessionUser>('/auth/me'),

  /** 档案（个人中心 / 顶栏身份；无 token 由后端回落演示身份） */
  profile: () => request<MeProfile>('/me/profile'),
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

export interface AuthResponse {
  token: string
  user: SessionUser
}

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
