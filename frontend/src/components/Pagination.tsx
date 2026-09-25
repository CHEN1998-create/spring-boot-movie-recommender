import { ChevronLeftIcon, ChevronRightIcon } from './Icons'

interface Props {
  page: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

/** 通用分页器：电影列表页 / 后台表格共用 */
export default function Pagination({ page, total, pageSize, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (pages <= 1) return null

  const nums: number[] = []
  for (let i = 1; i <= pages; i++) nums.push(i)

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="上一页"
      >
        <ChevronLeftIcon size={15} />
        上一页
      </button>
      {nums.map((n) => (
        <button
          key={n}
          className={`page-btn${n === page ? ' active' : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
      <button
        className="page-btn"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        aria-label="下一页"
      >
        下一页
        <ChevronRightIcon size={15} />
      </button>
      <span className="page-info">
        共 {total} 条
      </span>
    </div>
  )
}
