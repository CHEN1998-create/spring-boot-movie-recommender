import type { AdminOverview, HotTag, RecommendationLog } from '../types'

/** 后台总览指标（对应 PRD 6.1 后台指标） */
export const adminOverview: AdminOverview = {
  movieCount: 128,
  userCount: 1046,
  todayRatingCount: 86,
  favoriteRate: 23.4,
  recoCtr: 31.2,
  coldStartRate: 18.5,
}

/** 近 7 日评分数（仪表盘柱状图） */
export const weeklyRatings = [
  { day: '09-19', count: 64 },
  { day: '09-20', count: 72 },
  { day: '09-21', count: 58 },
  { day: '09-22', count: 91 },
  { day: '09-23', count: 103 },
  { day: '09-24', count: 96 },
  { day: '09-25', count: 86 },
]

/** 全站热门标签 Top 10（电影管理页标签下拉 & 推荐概览） */
export const hotTags: HotTag[] = [
  { tag: '科幻', count: 312 },
  { tag: '剧情', count: 287 },
  { tag: '悬疑', count: 201 },
  { tag: '动画', count: 186 },
  { tag: '喜剧', count: 154 },
  { tag: '爱情', count: 132 },
  { tag: '冒险', count: 121 },
  { tag: '犯罪', count: 98 },
  { tag: '动作', count: 87 },
  { tag: '奇幻', count: 76 },
]

/** 推荐策略命中分布（%） */
export const strategyDist = [
  { name: '标签偏好', value: 62, color: '#ff8c37' },
  { name: '热门加权', value: 28, color: '#5b8def' },
  { name: '冷启动补位', value: 10, color: '#8f7bf3' },
]

/** 最近推荐日志（对应 recommendation_logs 表） */
export const recoLogs: RecommendationLog[] = [
  { id: 1024, userName: '柠檬薄荷', strategy: '标签偏好', resultCount: 10, time: '2026-09-25 14:32' },
  { id: 1023, userName: '午夜场观众', strategy: '热门加权', resultCount: 10, time: '2026-09-25 14:18' },
  { id: 1022, userName: '胶片收藏家', strategy: '标签偏好', resultCount: 10, time: '2026-09-25 13:56' },
  { id: 1021, userName: 'Neon', strategy: '冷启动补位', resultCount: 8, time: '2026-09-25 13:40' },
  { id: 1020, userName: '苏格拉没有底', strategy: '标签偏好', resultCount: 10, time: '2026-09-25 13:22' },
  { id: 1019, userName: '海边的卡夫卡', strategy: '热门加权', resultCount: 10, time: '2026-09-25 12:47' },
  { id: 1018, userName: '雨天的鲸', strategy: '标签偏好', resultCount: 9, time: '2026-09-25 12:05' },
  { id: 1017, userName: '片片', strategy: '冷启动补位', resultCount: 8, time: '2026-09-25 11:36' },
]
