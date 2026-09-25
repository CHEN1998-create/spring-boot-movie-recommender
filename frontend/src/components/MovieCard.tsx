import { Link } from 'react-router-dom'
import type { Movie } from '../types'
import { HeartIcon, StarIcon } from './Icons'

interface Props {
  movie: Movie
  /** 榜单排名号（如首页热门榜显示 1/2/3...） */
  rank?: number
  /** 是否显示"已收藏"角标 */
  favorited?: boolean
}

/** 电影卡片：列表页、首页轨道、相关推荐通用 */
export default function MovieCard({ movie, rank, favorited }: Props) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className="poster">
        <img src={movie.posterUrl} alt={`${movie.title} 海报`} loading="lazy" />
        <span
          className="score-float"
          style={{ color: scoreColor(movie.rating) }}
        >
          <StarIcon size={12} filled />
          {movie.rating.toFixed(1)}
        </span>
        {favorited && (
          <span className="fav-flag">
            <HeartIcon size={13} filled />
          </span>
        )}
        {rank !== undefined && <span className="rank-no">{rank}</span>}
      </div>
      <div className="meta">
        <div className="title">{movie.title}</div>
        <div className="sub">
          <span>{movie.year}</span>
          <span className="dot" />
          <span className="ellipsis">{movie.tags.slice(0, 2).join(' / ')}</span>
        </div>
      </div>
    </Link>
  )
}

export function scoreColor(rating: number) {
  if (rating >= 9) return 'var(--score-high)'
  if (rating >= 8) return 'var(--score-mid)'
  if (rating >= 7) return 'var(--score-low)'
  return 'var(--score-poor)'
}
