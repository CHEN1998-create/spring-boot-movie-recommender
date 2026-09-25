import { useEffect, type ReactNode } from 'react'
import { XIcon } from './Icons'

interface Props {
  title: string
  open: boolean
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
}

/** 通用弹窗：后台新增/编辑电影用 */
export default function Modal({ title, open, onClose, footer, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="关闭">
            <XIcon size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}
