import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import RatingStars from '../components/RatingStars'
import { getMovie, movies } from '../data/movies'
import { myFavorites, myRatings } from '../data/user'
import { scoreColor } from '../components/MovieCard'
import { CheckIcon, HeartIcon, StarIcon } from '../components/Icons'

/** 电影详情页：海报简介 / 评分 / 收藏 / 标签 / 相关推荐（PRD 页面 4） */
export default function MovieDetailPage() {
  const { id } = useParams()
  const movie = getMovie(Number(id))

  // 本地交互状态（骨架阶段不落库，接接口后走 POST ratings / POST favorite）
  const initialFav = myFavorites.some((f) => f.movieId === Number(id))
  const initialRating = myRatings.find((r) => r.movieId === Number(id))?.score ?? 0
  const [fav, setFav] = useState(initialFav)
  const [myScore, setMyScore] = useState(initialRating) // 0 表示未评分
  const [justRated, setJustRated] = useState(false)

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
              <span>{movie.ratingCount.toLocaleString()} 人评过</span>
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
                onClick={() => setFav(!fav)}
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
                  style={{ background: scoreColor(movie.rating), color: '#10131a' }}
                >
                  <span className="n">{movie.rating.toFixed(1)}</span>
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>片屿均分</div>
                  <div className="count">{movie.ratingCount.toLocaleString()} 人评分</div>
                </div>
              </div>
              <hr className="rate-divider" />
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <RatingStars
                  initial={myScore ? myScore / 2 : 0}
                  onRate={(stars) => {
                    setMyScore(stars * 2)
                    setJustRated(true)
                    // TODO: 接 POST /api/movies/:id/ratings
                  }}
                />
                {myScore > 0 && (
                  <span className="badge badge-green">
                    {justRated ? '已提交（演示）' : '我的评分'} · {myScore} 分
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
