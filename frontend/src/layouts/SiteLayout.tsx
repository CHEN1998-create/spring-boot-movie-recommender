import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { api } from '../api'
import type { MeProfile } from '../api'
import {
  CompassIcon,
  FilmIcon,
  SearchIcon,
  UserIcon,
} from '../components/Icons'

/** 前台布局：顶部导航 + 内容 + 页脚（官网 / 用户前台共用骨架） */
export default function SiteLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  // 用户信息来自 /api/me/profile（登录体系上线后由 JWT 会话替换）
  const [user, setUser] = useState<MeProfile | null>(null)

  useEffect(() => {
    api
      .profile()
      .then(setUser)
      .catch(() => {})
  }, [])

  const nickname = user?.nickname ?? '游客'
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="site-shell">
      <header className="site-nav">
        <div className="inner">
          <Link to="/" className="brand">
            <span className="logo">
              <FilmIcon size={17} />
            </span>
            <span className="cn">片屿</span>
            <span className="en">FILMISLE</span>
          </Link>

          <nav className="nav-links">
            <NavLink to="/" end>
              首页
            </NavLink>
            <NavLink to="/movies">
              <FilmIcon size={15} />
              电影
            </NavLink>
            <NavLink to="/recommendations">
              <CompassIcon size={15} />
              为你推荐
            </NavLink>
            <NavLink to="/me">
              <UserIcon size={15} />
              个人中心
            </NavLink>
          </nav>

          <div className="nav-search">
            <span className="s-icon">
              <SearchIcon size={15} />
            </span>
            <input
              className="input"
              placeholder="搜索电影、标签…"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = (e.target as HTMLInputElement).value.trim()
                  window.location.href = `/movies?kw=${encodeURIComponent(v)}`
                }
              }}
            />
          </div>

          <div className="nav-user">
            {isAdmin && (
              <Link to="/admin" className="btn btn-ghost btn-sm">
                管理后台
              </Link>
            )}
            <Link to="/me" title={nickname}>
              <span className="avatar">{nickname[0]}</span>
            </Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="inner">
          <div>
            <Link to="/" className="brand" style={{ marginBottom: 8 }}>
              <span className="logo">
                <FilmIcon size={17} />
              </span>
              <span className="cn">片屿</span>
              <span className="en">FILMISLE</span>
            </Link>
            <p className="desc">
              记录你的每一部观影，让好电影找到对的人。评分与收藏沉淀为你的口味档案，推荐随你成长。
            </p>
          </div>
          <div className="footer-links">
            <Link to="/movies">全部电影</Link>
            <Link to="/recommendations">为你推荐</Link>
            <Link to="/me">个人中心</Link>
            <a href="https://letterboxd.com" target="_blank" rel="noreferrer">
              设计参考 · Letterboxd
            </a>
          </div>
          <span style={{ color: 'var(--text-3)', fontSize: 12.5 }}>
            © 2026 FilmIsle · {isHome ? 'V0.1 MVP' : 'Skeleton Demo'}
          </span>
        </div>
      </footer>
    </div>
  )
}
