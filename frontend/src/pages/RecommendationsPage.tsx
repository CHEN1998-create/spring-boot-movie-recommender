import { Link } from 'react-router-dom'
import { getMovie } from '../data/movies'
import { preferenceSummary, recommendationItems } from '../data/recommendations'
import { CompassIcon, SparkleIcon } from '../components/Icons'

const STRATEGY_LABEL: Record<string, { text: string; cls: string }> = {
  tag: { text: '标签偏好', cls: 'badge-orange' },
  hot: { text: '热门加权', cls: 'badge-blue' },
  'cold-start': { text: '冷启动补位', cls: 'badge-purple' },
}

/** 推荐页：个性化 TopN + 推荐理由（PRD 页面 5） */
export default function RecommendationsPage() {
  return (
    <div className="container page">
      {/* 偏好摘要 */}
      <div className="reco-hero">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CompassIcon size={22} style={{ color: 'var(--accent)' }} />
            为你推荐
          </h2>
          <p className="sub">
            基于你的 {preferenceSummary.ratedCount} 条评分和 {preferenceSummary.favoriteCount} 个收藏，本次生成{' '}
            {recommendationItems.length} 条结果，已过滤你看过的片
          </p>
        </div>
        <div className="pref-tags">
          <span className="label">你的偏好标签</span>
          {preferenceSummary.topTags.map((t) => (
            <span key={t} className="chip static mini active">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 推荐列表 */}
      <div className="reco-list">
        {recommendationItems.map((item, idx) => {
          const movie = getMovie(item.movieId)
          if (!movie) return null
          const st = STRATEGY_LABEL[item.strategy]
          return (
            <div className="reco-item" key={item.movieId}>
              <Link to={`/movies/${movie.id}`} className="thumb">
                <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
              </Link>
              <div>
                <div className="r-title">
                  <span style={{ color: 'var(--text-3)', fontStyle: 'italic', fontWeight: 800 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                  <span className={`badge ${st.cls}`}>{st.text}</span>
                </div>
                <div className="r-sub">
                  {movie.year} · {movie.region} · {movie.tags.join(' / ')} · 均分{' '}
                  {movie.rating.toFixed(1)}
                </div>
                <p className="reason">
                  <SparkleIcon
                    size={13}
                    style={{ color: 'var(--accent)', display: 'inline', verticalAlign: -2, marginRight: 6 }}
                  />
                  {item.reason}
                </p>
              </div>
              <div className="reco-score-box">
                <div className="num">{item.score.toFixed(2)}</div>
                <div className="bar">
                  <i style={{ width: `${item.score * 100}%` }} />
                </div>
                <div className="strategy">推荐分值</div>
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 12.5, marginTop: 24 }}>
        <span className="demo-note" style={{ marginRight: 10 }}>
          骨架演示
        </span>
        推荐结果由「标签偏好 → 热门加权 → 冷启动补位」三级策略生成，接接口后来自
        <code style={{ color: 'var(--blue)', margin: '0 4px' }}>GET /api/recommendations</code>
      </p>
    </div>
  )
}
