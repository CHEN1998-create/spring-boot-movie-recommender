import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import RatingStars from '../components/RatingStars'
import { getMovie, movies } from '../data/movies'
import { api } from '../api'
import { scoreColor } from '../components/MovieCard'
import { CheckIcon, HeartIcon, StarIcon } from '../components/Icons'

/** 电影详情页：海报简介 / 评分 / 收藏 / 标签 / 相关推荐（PRD 页面 4） */
export default function MovieDetailPage() {
  const { id } = useParams()
  const movie = getMovie(Number(id))

  // 我的评分 / 收藏：来自后端（POST ratings、POST/DELETE favorite 落库）
  const [fav, setFav] = useState(false)
  const [myScore, setMyScore] = useState(0) // 0 表示未评分
  const [justRated, setJustRated] = useState(false)
  const [busy, setBusy] = useState(false)
  // 聚合分展示：评分接口返回最新均分/人数后本地覆盖（影片基础信息仍来自前端数据源）
  const [aggRating, setAggRating] = useState(movie?.rating ?? 0)
  const [aggCount, setAggCount] = useState(movie?.ratingCount ?? 0)

  const movieId = movie?.id
  useEffect(() => {
    if (!movieId) return
    let cancelled = false
    api
      .interaction(movieId)
      .then((s) => {
        if (cancelled) return
        setFav(s.favorited)
        setMyScore(s.myScore ?? 0)
        setJustRated(false)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [movieId])

  const handleRate = async (stars: number) => {
    if (!movieId || busy) return
    const score = stars * 2
    setBusy(true)
    try {
      const r = await api.rate(movieId, score)
      setMyScore(r.score)
      setJustRated(true)
      if (r.movieRating != null) setAggRating(r.movieRating)
      if (r.movieRatingCount != null) setAggCount(r.movieRatingCount)
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const toggleFav = async () => {
    if (!movieId || busy) return
    const next = !fav
    setBusy(true)
    try {
      const r = await api.setFavorite(movieId, next)
      setFav(r.favorited)
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const related = useMemo(() => {
    if (!movie) return []
    return movies
      .filter((m) => m.id !== movie.id && m.tags.some((t) => movie.tags.includes(t)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }, [movie])

  if (!movie) {
    return (
      <div className="container page">
        <div className="empty">
          <div className="icon">🎞️</div>
          <p>没有找到这部电影，可能已被下架</p>
          <Link to="/movies" className="btn btn-ghost" style={{ marginTop: 16 }}>
            返回电影库
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 详情头部 */}
      <section className="detail-hero">
        <div className="container detail-main">
          <div className="detail-poster">
            <img src={movie.posterUrl} alt={`${movie.title} 海报`} />
          </div>

          <div className="detail-info">
            <div className="title-row">
              <h1>{movie.title}</h1>
              <span className="orig">
                {movie.originalTitle}（{movie.year}）
              </span>
            </div>

            <div className="meta-line">
              <span>{movie.year}</span>
              <span className="dot" />
              <span>{movie.region}</span>
              <span className="dot" />
              <span>{movie.duration} 分钟</span>
              <span className="dot" />
              <span>导演：{movie.director}</span>
              <span className="dot" />
              <span>{aggCount.toLocaleString()} 人评过</span>
            </div>

            <div className="tags">
              {movie.tags.map((t) => (
                <Link key={t} to={`/movies?tag=${encodeURIComponent(t)}`} className="chip mini">
                  {t}
                </Link>
              ))}
            </div>

            <p className="summary">{movie.summary}</p>

            <div className="detail-actions">
              <button
                className={`fav-btn${fav ? ' on' : ''}`}
                onClick={toggleFav}
                disabled={busy}
                title={fav ? '点击取消收藏' : '加入收藏'}
              >
                <HeartIcon size={16} filled={fav} />
                {fav ? '已收藏' : '收藏'}
              </button>
              {fav && (
                <span className="badge badge-orange">
                  <CheckIcon size={12} style={{ marginRight: 4 }} />
                  收藏会参与推荐计算
                </span>
              )}
            </div>

            {/* 我的评分面板 */}
            <div className="rate-panel">
              <div className="panel-title">给这部电影打个分</div>
              <div className="avg-row">
                <span
                  className="score-badge"
                  style={{ background: scoreColor(aggRating), color: '#10131a' }}
                >
                  <span className="n">{aggRating.toFixed(1)}</span>
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>片屿均分</div>
                  <div className="count">{aggCount.toLocaleString()} 人评分</div>
                </div>
              </div>
              <hr className="rate-divider" />
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <RatingStars initial={myScore ? myScore / 2 : 0} onRate={handleRate} />
                {myScore > 0 && (
                  <span className="badge badge-green">
                    {justRated ? '已提交' : '我的评分'} · {myScore} 分
                  </span>
                )}
              </div>
              <div style={{ color: 'var(--text-3)', fontSize: 12.5, marginTop: 10 }}>
                评分与收藏都会沉淀到你的口味档案，影响「为你推荐」的结果。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 演职员 */}
      <div className="container page" style={{ paddingTop: 28 }}>
        <section style={{ marginBottom: 40 }}>
          <div className="cast-row">
            <span>
              <b>导演</b>
              {movie.director}
            </span>
            <span>
              <b>主演</b>
              {movie.cast.join(' / ')}
            </span>
          </div>
        </section>

        {/* 相关推荐 */}
        {related.length > 0 && (
          <section>
            <div className="section-head">
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StarIcon size={18} style={{ color: 'var(--accent)' }} />
                  看过这部的人也在看
                </h2>
                <p className="sub">基于标签「{movie.tags.join(' / ')}」的相关推荐</p>
              </div>
              <Link to="/recommendations" className="more">
                为你推荐 <HeartIcon size={13} />
              </Link>
            </div>
            <div className="related-grid">
              {related.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
