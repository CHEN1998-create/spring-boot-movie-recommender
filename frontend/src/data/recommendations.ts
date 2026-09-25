import type { RecommendationItem } from '../types'

/**
 * 个性化推荐结果（对应 GET /api/recommendations 的返回）。
 * 策略：标签偏好为主，热门加权兜底，冷启动补位。
 * 已过滤掉当前用户已评分 / 已收藏的影片。
 */
export const recommendationItems: RecommendationItem[] = [
  {
    movieId: 11,
    score: 0.94,
    reason: '你近期给高分的《星际穿越》《流浪地球》多为科幻题材，这部沙漠科幻的视听风格与你的偏好高度吻合',
    matchedTags: ['科幻', '冒险'],
    strategy: 'tag',
  },
  {
    movieId: 9,
    score: 0.91,
    reason: '你为《盗梦空间》打了 8 分，同属"虚拟世界 + 热血冒险"的组合，且该片在你偏好的科幻标签下热度持续上升',
    matchedTags: ['科幻', '冒险'],
    strategy: 'tag',
  },
  {
    movieId: 15,
    score: 0.88,
    reason: '诺兰作品命中率：你给《星际穿越》《盗梦空间》的评分均在 8 分以上，导演维度的强关联推荐',
    matchedTags: ['科幻', '悬疑'],
    strategy: 'tag',
  },
  {
    movieId: 18,
    score: 0.86,
    reason: '你喜欢剧情向高分片，这部人物传记的叙事结构与《盗梦空间》的观众重合度达 61%',
    matchedTags: ['剧情'],
    strategy: 'tag',
  },
  {
    movieId: 17,
    score: 0.84,
    reason: '你在动画标签下的平均评分高达 9.5 分（千与千寻、疯狂动物城），这部是今年动画类型的新晋口碑王',
    matchedTags: ['动画'],
    strategy: 'tag',
  },
  {
    movieId: 7,
    score: 0.79,
    reason: '站内热度 Top 5：本周被收藏 412 次，且收藏者与你的口味相似度较高',
    matchedTags: ['剧情', '喜剧'],
    strategy: 'hot',
  },
  {
    movieId: 10,
    score: 0.76,
    reason: '你常给"现实主义剧情片"高分，这部田野调查式的作品在你所在片区的完成率高达 88%',
    matchedTags: ['剧情', '文艺'],
    strategy: 'tag',
  },
  {
    movieId: 6,
    score: 0.73,
    reason: '影史常青树：与《千与千寻》并列站内五星率最高的两部作品，你的片单里还缺这一部',
    matchedTags: ['剧情'],
    strategy: 'hot',
  },
  {
    movieId: 14,
    score: 0.71,
    reason: '补位推荐：你的评分记录还较少，先从这部站内均分 9.1 的口碑片开始建立偏好',
    matchedTags: ['爱情'],
    strategy: 'cold-start',
  },
]

/** 偏好摘要：推荐页顶部展示的"为什么推给你" */
export const preferenceSummary = {
  topTags: ['科幻', '剧情', '动画'],
  ratedCount: 6,
  favoriteCount: 5,
}
