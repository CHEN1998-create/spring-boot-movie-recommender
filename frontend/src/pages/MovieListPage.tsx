import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import Pagination from '../components/Pagination'
import { movies, ALL_TAGS } from '../data/movies'
import { myFavorites } from '../data/user'
import { SearchIcon } from '../components/Icons'

const PAGE_SIZE = 12

type SortKey = 'rating' | 'year' | 'count'

/** 电影列表页：浏览 / 搜索 / 标签筛选 / 排序 / 分页（PRD 页面 3） */
export default function MovieListPage() {
  const [params] = useSearchParams()
  const [kw, setKw] = useState(params.get('kw') ?? '')
  const [tag, setTag] = useState(params.get('tag') ?? '')
  const [sort, setSort] = useState<SortKey>('rating')
  const [page, setPage] = useState(1)

  const favIds = new Set(myFavorites.map((f) => f.movieId))

  const filtered = useMemo(() => {
    let list = movies.filter((m) => {
      const kwOk =
        !kw.trim() ||
        m.title.toLowerCase().includes(kw.trim().toLowerCase()) ||
        m.originalTitle.toLowerCase().includes(kw.trim().toLowerCase())
      const tagOk = !tag || m.tags.includes(tag)
      return kwOk && tagOk
    })
    list = [...list].sort((a, b) =>
      sort === 'rating' ? b.rating - a.rating : sort === 'year' ? b.year - a.year : b.ratingCount - a.ratingCount,
    )
    return list
  }, [kw, tag, sort])

  const pageList = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="container page">
      <div className="section-head">
        <div>
          <h2>电影库</h2>
          <p className="sub">浏览、搜索、按标签筛选，找到你的下一部片</p>
        </div>
      </div>

      {/* 工具栏：搜索 / 标签 / 排序 */}
      <div className="list-toolbar">
        <div className="toolbar-row">
          <span className="label">搜索</span>
          <span style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
            <span
              style={{
                position: 'absolute',
                left: 11,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-3)',
                display: 'flex',
              }}
            >
              <SearchIcon size={15} />
            </span>
            <input
              className="input"
              style={{ paddingLeft: 34, height: 34 }}
              placeholder="输入片名，如「星际穿越」"
              value={kw}
              onChange={(e) => {
                setKw(e.target.value)
                setPage(1)
              }}
            />
          </span>
          <div className="grow">
            <span className="label" style={{ width: 'auto' }}>
              排序
            </span>
            <select
              className="input sort-select"
              style={{ height: 34 }}
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey)
                setPage(1)
              }}
            >
              <option value="rating">综合评分</option>
              <option value="year">最新上映</option>
              <option value="count">评分人数</option>
            </select>
          </div>
        </div>
        <div className="toolbar-row">
          <span className="label">标签</span>
          <button className={`chip${tag === '' ? ' active' : ''}`} onClick={() => { setTag(''); setPage(1) }}>
            全部
          </button>
          {ALL_TAGS.map((t) => (
            <button
              key={t}
              className={`chip${tag === t ? ' active' : ''}`}
              onClick={() => {
                setTag(tag === t ? '' : t)
                setPage(1)
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="list-meta">
        {kw || tag ? (
          <>
            筛选「<b>{[kw, tag].filter(Boolean).join(' · ')}</b>」，
          </>
        ) : null}
        共找到 <b>{filtered.length}</b> 部电影
      </p>

      {pageList.length > 0 ? (
        <div className="movie-grid">
          {pageList.map((m) => (
            <MovieCard key={m.id} movie={m} favorited={favIds.has(m.id)} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="icon">🎬</div>
          <p>没有找到匹配的电影，换个关键词或标签试试</p>
        </div>
      )}

      <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  )
}
