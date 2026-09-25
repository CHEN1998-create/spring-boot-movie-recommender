import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { RecommendationResponse } from '../api'
import { CompassIcon, SparkleIcon } from '../components/Icons'

const STRATEGY_LABEL: Record<string, { text: string; cls: string }> = {
  tag: { text: '标签偏好', cls: 'badge-orange' },
  hot: { text: '热门加权', cls: 'badge-blue' },
  'cold-start': { text: '冷启动补位', cls: 'badge-purple' },
}

/** 推荐页：个性化 TopN + 推荐理由（PRD 页面 5，数据来自 GET /api/recommendations） */
export default function RecommendationsPage() {
  const [data, setData] = useState<RecommendationResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .recommendations()
      .then((r) => {
        if (!cancelled) setData(r)
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div className="container page">
        <div className="empty">
          <div className="icon">🧭</div>
          <p>推荐生成失败：{error}</p>
          <button className="btn btn-ghost" onClick={() => location.reload()} style={{ marginTop: 16 }}>
            重试
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container page">
        <div className="empty">
          <div className="icon">🧭</div>
          <p>正在根据你的口味生成推荐…</p>
        </div>
      </div>
    )
  }

  const { items, summary } = data

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
            基于你的 {summary.ratedCount} 条评分和 {summary.favoriteCount} 个收藏，本次生成{' '}
            {items.length} 条结果，已过滤你看过的片
          </p>
        </div>
        {summary.topTags.length > 0 && (
          <div className="pref-tags">
            <span className="label">你的偏好标签</span>
            {summary.topTags.map((t) => (
              <span key={t} className="chip static mini active">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 推荐列表 */}
      {items.length === 0 ? (
        <div className="empty">
          <div className="icon">🎞️</div>
          <p>你已经看完全站影片，去电影库重温经典吧</p>
          <Link to="/movies" className="btn btn-ghost" style={{ marginTop: 16 }}>
            返回电影库
          </Link>
        </div>
      ) : (
        <div className="reco-list">
          {items.map((item, idx) => {
            const st = STRATEGY_LABEL[item.strategy] ?? STRATEGY_LABEL.hot
            return (
              <div className="reco-item" key={item.movieId}>
                <Link to={`/movies/${item.movieId}`} className="thumb">
                  <img src={item.posterUrl} alt={item.title} loading="lazy" />
                </Link>
                <div>
                  <div className="r-title">
                    <span style={{ color: 'var(--text-3)', fontStyle: 'italic', fontWeight: 800 }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <Link to={`/movies/${item.movieId}`}>{item.title}</Link>
                    <span className={`badge ${st.cls}`}>{st.text}</span>
                  </div>
                  <div className="r-sub">
                    {item.year} · {item.region} · {item.tags.join(' / ')} · 均分{' '}
                    {item.rating.toFixed(1)}
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
      )}

      <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 12.5, marginTop: 24 }}>
        推荐结果由「标签偏好 → 热门加权 → 冷启动补位」三级策略实时生成，来自
        <code style={{ color: 'var(--blue)', margin: '0 4px' }}>GET /api/recommendations</code>
      </p>
    </div>
  )
}
