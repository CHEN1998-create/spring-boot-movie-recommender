import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../components/RatingStars'
import { getMovie } from '../data/movies'
import { ALL_TAGS } from '../data/movies'
import { api } from '../api'
import type { MeProfile } from '../api'
import type { MyRating, MyFavorite } from '../types'
import { CheckIcon, ClockIcon, HeartIcon } from '../components/Icons'

type Tab = 'ratings' | 'favorites' | 'prefs'

/** 个人中心：评分历史 / 收藏 / 推荐偏好（PRD 页面 6，数据来自 /api/me/*） */
export default function MePage() {
  const [tab, setTab] = useState<Tab>('ratings')
  const [profile, setProfile] = useState<MeProfile | null>(null)
  const [ratings, setRatings] = useState<MyRating[]>([])
  const [favorites, setFavorites] = useState<MyFavorite[]>([])
  const [error, setError] = useState('')
  // 偏好标签面板：以画像标签为初值，勾选交互为本地演示
  const [tags, setTags] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.profile(), api.myRatings(), api.myFavorites()])
      .then(([p, r, f]) => {
        if (cancelled) return
        setProfile(p)
        setRatings(r)
        setFavorites(f)
        setTags(p.topTags)
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
          <div className="icon">👤</div>
          <p>加载失败：{error}</p>
          <button className="btn btn-ghost" onClick={() => location.reload()} style={{ marginTop: 16 }}>
            重试
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container page">
        <div className="empty">
          <div className="icon">👤</div>
          <p>正在加载个人档案…</p>
        </div>
      </div>
    )
  }

  const toggleTag = (t: string) => {
    setSaved(false)
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  return (
    <div className="container page">
      {/* 头部档案 */}
      <div className="me-head">
        <span className="avatar lg">{profile.nickname[0]}</span>
        <div className="info">
          <h1>{profile.nickname}</h1>
          <p className="mail">
            {profile.email} · {profile.joinedAt} 加入片屿
          </p>
          <div className="tags">
            <span className="badge badge-gray">角色 · {profile.role === 'ADMIN' ? '管理员' : '注册用户'}</span>
            {tags.slice(0, 4).map((t) => (
              <span key={t} className="badge badge-orange">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="me-stats">
          <div>
            <b>{ratings.length}</b>
            <span>评分</span>
          </div>
          <div>
            <b>{favorites.length}</b>
            <span>收藏</span>
          </div>
          <div>
            <b>{tags.length}</b>
            <span>偏好标签</span>
          </div>
        </div>
      </div>

      {/* 页签 */}
      <div className="tabs">
        <button className={`tab${tab === 'ratings' ? ' active' : ''}`} onClick={() => setTab('ratings')}>
          我的评分（{ratings.length}）
        </button>
        <button className={`tab${tab === 'favorites' ? ' active' : ''}`} onClick={() => setTab('favorites')}>
          我的收藏（{favorites.length}）
        </button>
        <button className={`tab${tab === 'prefs' ? ' active' : ''}`} onClick={() => setTab('prefs')}>
          我的偏好
        </button>
      </div>

      {/* 我的评分 */}
      {tab === 'ratings' && (
        <div className="record-list">
          {ratings.length === 0 && (
            <p style={{ color: 'var(--text-3)', fontSize: 13 }}>还没有评分记录，去电影库给第一部影片打分吧。</p>
          )}
          {ratings.map((r) => {
            const m = getMovie(r.movieId)
            if (!m) return null
            return (
              <div className="record-item" key={r.movieId}>
                <Link to={`/movies/${m.id}`} className="thumb">
                  <img src={m.posterUrl} alt={m.title} loading="lazy" />
                </Link>
                <div className="r-info">
                  <Link to={`/movies/${m.id}`} className="r-title">
                    {m.title}
                  </Link>
                  <div className="r-sub">
                    {m.year} · {m.tags.join(' / ')}
                  </div>
                </div>
                <div className="r-right">
                  <span style={{ color: 'var(--text-3)', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <ClockIcon size={13} />
                    {r.ratedAt.slice(0, 10)}
                  </span>
                  <RatingStars readOnly initial={r.score / 2} size={16} />
                  <span className="badge badge-green">{r.score} 分</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 我的收藏 */}
      {tab === 'favorites' && (
        <div className="record-list">
          {favorites.length === 0 && (
            <p style={{ color: 'var(--text-3)', fontSize: 13 }}>收藏夹还是空的，遇到喜欢的片子点个收藏吧。</p>
          )}
          {favorites.map((f) => {
            const m = getMovie(f.movieId)
            if (!m) return null
            return (
              <div className="record-item" key={f.movieId}>
                <Link to={`/movies/${m.id}`} className="thumb">
                  <img src={m.posterUrl} alt={m.title} loading="lazy" />
                </Link>
                <div className="r-info">
                  <Link to={`/movies/${m.id}`} className="r-title">
                    {m.title}
                  </Link>
                  <div className="r-sub">
                    {m.year} · {m.tags.join(' / ')}
                  </div>
                </div>
                <div className="r-right">
                  <span style={{ color: 'var(--text-3)', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <ClockIcon size={13} />
                    {f.favoritedAt.slice(0, 10)} 收藏
                  </span>
                  <span className="badge badge-orange">均分 {m.rating.toFixed(1)}</span>
                </div>
              </div>
            )
          })}
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 8 }}>
            <HeartIcon size={13} style={{ color: 'var(--red)', display: 'inline', verticalAlign: -2, marginRight: 5 }} />
            收藏影片会以更高权重参与推荐计算
          </p>
        </div>
      )}

      {/* 我的偏好 */}
      {tab === 'prefs' && (
        <div className="pref-panel">
          <h3>推荐偏好标签</h3>
          <p className="hint">
            当前画像由你的评分与收藏行为自动计算（当前：{profile.topTags.join('、') || '暂无'}）；下方勾选为演示交互，登录体系上线后保存到用户画像。
          </p>
          <div className="tag-cloud">
            {ALL_TAGS.map((t) => (
              <button
                key={t}
                className={`chip${tags.includes(t) ? ' active' : ''}`}
                onClick={() => toggleTag(t)}
              >
                {tags.includes(t) && <CheckIcon size={12} style={{ marginRight: 5 }} />}
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => setSaved(true)}>
              保存偏好（{tags.length} 个标签）
            </button>
            {saved && (
              <span className="badge badge-green">
                <CheckIcon size={12} style={{ marginRight: 4 }} />
                已保存（演示）
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
