import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../components/Modal'
import Pagination from '../../components/Pagination'
import { ALL_TAGS, movies as seedMovies } from '../../data/movies'
import type { Movie } from '../../types'
import { CheckIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from '../../components/Icons'

const PAGE_SIZE = 8

type FormState = {
  id?: number
  title: string
  originalTitle: string
  year: number
  region: string
  duration: number
  director: string
  cast: string
  summary: string
  tags: string[]
  posterUrl: string
}

const emptyForm: FormState = {
  title: '',
  originalTitle: '',
  year: new Date().getFullYear(),
  region: '',
  duration: 90,
  director: '',
  cast: '',
  summary: '',
  tags: [],
  posterUrl: '',
}

/** 电影管理页：新增 / 编辑 / 标签管理（PRD 页面 8，骨架阶段操作仅作用于前端状态） */
export default function AdminMovies() {
  const [list, setList] = useState<Movie[]>(seedMovies)
  const [kw, setKw] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [toast, setToast] = useState('')

  const filtered = useMemo(
    () =>
      list.filter(
        (m) =>
          !kw.trim() ||
          m.title.toLowerCase().includes(kw.trim().toLowerCase()) ||
          m.originalTitle.toLowerCase().includes(kw.trim().toLowerCase()),
      ),
    [list, kw],
  )
  const pageList = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(''), 2200)
  }

  const openCreate = () => {
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (m: Movie) => {
    setForm({
      id: m.id,
      title: m.title,
      originalTitle: m.originalTitle,
      year: m.year,
      region: m.region,
      duration: m.duration,
      director: m.director,
      cast: m.cast.join(' / '),
      summary: m.summary,
      tags: m.tags,
      posterUrl: m.posterUrl,
    })
    setModalOpen(true)
  }

  const save = () => {
    if (!form.title.trim()) {
      showToast('请填写片名')
      return
    }
    if (form.id) {
      setList((prev) =>
        prev.map((m) =>
          m.id === form.id
            ? { ...m, ...form, cast: form.cast.split(/[/,，]/).map((s) => s.trim()).filter(Boolean) }
            : m,
        ),
      )
      showToast(`已保存修改：${form.title}（演示）`)
    } else {
      const newMovie: Movie = {
        id: Math.max(...list.map((m) => m.id)) + 1,
        title: form.title,
        originalTitle: form.originalTitle || form.title,
        year: form.year,
        duration: form.duration,
        director: form.director || '未知',
        cast: form.cast.split(/[/,，]/).map((s) => s.trim()).filter(Boolean),
        region: form.region || '未知',
        summary: form.summary,
        tags: form.tags,
        rating: 0,
        ratingCount: 0,
        posterUrl:
          form.posterUrl ||
          `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
            (form.title || 'film') + ' cinematic movie poster, portrait composition',
          )}&image_size=portrait_4_3`,
        createdAt: '2026-09-25 15:00',
      }
      setList((prev) => [newMovie, ...prev])
      showToast(`已新增电影：${form.title}（演示）`)
    }
    setModalOpen(false)
    setPage(1)
  }

  const remove = (m: Movie) => {
    setList((prev) => prev.filter((x) => x.id !== m.id))
    showToast(`已下架：${m.title}（演示）`)
  }

  const toggleTag = (t: string) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t],
    }))

  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <h3>
            影片库
            <span className="sub">共 {filtered.length} 部</span>
          </h3>
          <div className="manage-toolbar">
            <span style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-3)',
                  display: 'flex',
                }}
              >
                <SearchIcon size={14} />
              </span>
              <input
                className="input"
                style={{ paddingLeft: 32 }}
                placeholder="搜索片名…"
                value={kw}
                onChange={(e) => {
                  setKw(e.target.value)
                  setPage(1)
                }}
              />
            </span>
            <button className="btn btn-primary" onClick={openCreate}>
              <PlusIcon size={15} />
              新增电影
            </button>
          </div>
        </div>

        <div className="panel-body flush">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>片名</th>
                <th>年份</th>
                <th>标签</th>
                <th>均分</th>
                <th>评分人数</th>
                <th>入库时间</th>
                <th style={{ textAlign: 'right' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {pageList.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="movie-title-cell">
                      <img className="m-thumb" src={m.posterUrl} alt="" loading="lazy" />
                      <div>
                        <div className="m-name">
                          <Link to={`/movies/${m.id}`}>{m.title}</Link>
                        </div>
                        <div className="m-sub">
                          {m.originalTitle} · {m.director}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{m.year}</td>
                  <td>
                    <div className="tag-group">
                      {m.tags.map((t) => (
                        <span key={t} className="tag-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    {m.ratingCount === 0 ? (
                      <span className="badge badge-gray">暂无</span>
                    ) : (
                      <span className="badge badge-green">{m.rating.toFixed(1)}</span>
                    )}
                  </td>
                  <td>{m.ratingCount.toLocaleString()}</td>
                  <td>{m.createdAt.slice(0, 10)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" title="编辑" onClick={() => openEdit(m)}>
                        <PencilIcon size={14} />
                      </button>
                      <button className="icon-btn danger" title="下架" onClick={() => remove(m)}>
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />

      {/* 新增 / 编辑弹窗 */}
      <Modal
        title={form.id ? `编辑电影 · ${form.title}` : '新增电影'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>
              取消
            </button>
            <button className="btn btn-primary" onClick={save}>
              <CheckIcon size={15} />
              {form.id ? '保存修改' : '创建电影'}
            </button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>片名 *</label>
            <input
              placeholder="如：星际穿越"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="field">
            <label>外文名</label>
            <input
              placeholder="Interstellar"
              value={form.originalTitle}
              onChange={(e) => setForm({ ...form, originalTitle: e.target.value })}
            />
          </div>
          <div className="field">
            <label>年份</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            />
          </div>
          <div className="field">
            <label>地区</label>
            <input
              placeholder="美国 / 中国大陆"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
          </div>
          <div className="field">
            <label>时长（分钟）</label>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            />
          </div>
          <div className="field">
            <label>导演</label>
            <input
              placeholder="克里斯托弗·诺兰"
              value={form.director}
              onChange={(e) => setForm({ ...form, director: e.target.value })}
            />
          </div>
          <div className="field">
            <label>主演（用 / 分隔）</label>
            <input
              placeholder="马修·麦康纳 / 安妮·海瑟薇"
              value={form.cast}
              onChange={(e) => setForm({ ...form, cast: e.target.value })}
            />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>简介</label>
            <textarea
              rows={3}
              placeholder="100 字以内的剧情简介"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>海报链接（留空则按片名自动生成占位海报）</label>
            <input
              placeholder="https://…"
              value={form.posterUrl}
              onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
            />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>标签（多选，参与推荐计算）</label>
            <div className="tag-select">
              {ALL_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`chip${form.tags.includes(t) ? ' active' : ''}`}
                  onClick={() => toggleTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {toast && (
        <div className="save-toast">
          <CheckIcon size={15} />
          {toast}
        </div>
      )}
    </>
  )
}
