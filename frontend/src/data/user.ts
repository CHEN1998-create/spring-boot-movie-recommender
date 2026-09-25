import type { CurrentUser, MyFavorite, MyRating } from '../types'

/** 当前登录用户（骨架阶段写死，后续由 /api/me/profile 返回） */
export const currentUser: CurrentUser = {
  id: 1,
  nickname: '陈屿',
  email: 'demo@filmisle.cn',
  role: 'ADMIN',
  joinedAt: '2026-03-01',
}

/** 我的评分历史（对应 ratings 表的当前用户数据） */
export const myRatings: MyRating[] = [
  { movieId: 3, score: 10, ratedAt: '2026-09-15 21:30' },
  { movieId: 1, score: 9, ratedAt: '2026-09-20 23:05' },
  { movieId: 2, score: 8, ratedAt: '2026-09-18 20:14' },
  { movieId: 13, score: 9, ratedAt: '2026-09-06 22:47' },
  { movieId: 4, score: 8, ratedAt: '2026-09-10 19:58' },
  { movieId: 5, score: 7, ratedAt: '2026-08-30 21:12' },
]

/** 我的收藏（对应 favorites 表） */
export const myFavorites: MyFavorite[] = [
  { movieId: 3, favoritedAt: '2026-09-15 21:32' },
  { movieId: 1, favoritedAt: '2026-09-20 23:08' },
  { movieId: 12, favoritedAt: '2026-09-01 15:20' },
  { movieId: 16, favoritedAt: '2026-08-25 22:41' },
  { movieId: 8, favoritedAt: '2026-08-12 19:03' },
]

/** 我的推荐偏好标签（个人中心「我的偏好」） */
export const myPreferredTags = ['科幻', '悬疑', '剧情', '动画']
