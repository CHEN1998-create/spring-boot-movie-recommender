import { useState } from 'react'
import { StarIcon } from './Icons'

interface Props {
  /** 初始星级 1-5 */
  initial?: number
  /** 只读展示模式 */
  readOnly?: boolean
  size?: number
  onRate?: (stars: number) => void
}

/**
 * 星级评分组件：5 星制，内部换算为 10 分制（PRD ratings.score 为 int）。
 * 详情页提交评分、个人中心回显都用它。
 */
export default function RatingStars({ initial = 0, readOnly = false, size = 26, onRate }: Props) {
  const [stars, setStars] = useState(initial)
  const [hover, setHover] = useState(0)

  const shown = hover || stars
  const hints = ['', '不看', '较差', '还行', '推荐', '力荐']

  return (
    <span className="stars-row" style={readOnly ? { opacity: 0.95 } : undefined}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={`star-btn${i <= shown ? ' on' : ''}`}
          disabled={readOnly}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
          onMouseEnter={() => !readOnly && setHover(i)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => {
            if (readOnly) return
            setStars(i)
            onRate?.(i)
          }}
          aria-label={`${i} 星`}
        >
          <StarIcon size={size} filled={i <= shown} />
        </button>
      ))}
      {!readOnly && (
        <span className="stars-hint">
          {shown > 0 ? (
            <>
              <b>{shown * 2} 分</b> · {hints[shown]}
            </>
          ) : (
            '点击评分'
          )}
        </span>
      )}
    </span>
  )
}
