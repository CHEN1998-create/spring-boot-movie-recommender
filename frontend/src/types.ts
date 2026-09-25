// 类型定义 —— 与 PRD 数据表结构对齐，后续接接口时可直接替换为 API 返回类型

/** 电影（对应 movies + movie_tags 表） */
export interface Movie {
  id: number
  title: string
  originalTitle: string
  year: number
  duration: number // 分钟
  director: string
  cast: string[]
  region: string
  summary: string
  tags: string[]
  rating: number // 平台均分，0-10
  ratingCount: number
  posterUrl: string
  createdAt: string
}

/** 当前登录用户（对应 users 表） */
export interface CurrentUser {
  id: number
  nickname: string
  email: string
  role: 'USER' | 'ADMIN'
  joinedAt: string
}

/** 我的评分记录（对应 ratings 表） */
export interface MyRating {
  movieId: number
  score: number // 1-10
  ratedAt: string
}

/** 我的收藏（对应 favorites 表） */
export interface MyFavorite {
  movieId: number
  favoritedAt: string
}

/** 推荐条目（对应 GET /api/recommendations 返回） */
export interface RecommendationItem {
  movieId: number
  score: number // 0-1 归一化推荐分
  reason: string // 推荐理由
  matchedTags: string[] // 命中的偏好标签
  strategy: 'tag' | 'hot' | 'cold-start' // 推荐策略
}

/** 后台统计与公开概览类型统一收口在 api.ts（与后端 DTO 对齐） */
