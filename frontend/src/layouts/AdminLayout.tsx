import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { currentUser } from '../data/user'
import {
  ChartIcon,
  CompassIcon,
  FilmIcon,
  GridIcon,
  HomeIcon,
  LogOutIcon,
} from '../components/Icons'

const MENU = [
  {
    group: '概览',
    items: [
      { to: '/admin', label: '数据看板', icon: ChartIcon, end: true },
    ],
  },
  {
    group: '内容管理',
    items: [
      { to: '/admin/movies', label: '电影管理', icon: GridIcon, end: false },
    ],
  },
  {
    group: '推荐运营',
    items: [
      { to: '/admin/recommendations', label: '推荐概览', icon: CompassIcon, end: false },
    ],
  },
]

const TITLES: Record<string, string> = {
  '/admin': '数据看板',
  '/admin/movies': '电影管理',
  '/admin/recommendations': '推荐概览',
}

/** 后台布局：侧边栏 + 顶栏 + 内容区（PRD admin.xxx.com） */
export default function AdminLayout() {
  const { pathname } = useLocation()

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand">
          <span className="logo">
            <FilmIcon size={17} />
          </span>
          <span className="cn" style={{ fontSize: 15 }}>
            片屿管理台
          </span>
          <span className="brand-tag">ADMIN</span>
        </div>

        <nav className="admin-menu">
          {MENU.map((g) => (
            <div key={g.group}>
              <div className="group">{g.group}</div>
              {g.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="side-foot">
          <NavLink to="/">
            <HomeIcon size={15} />
            返回前台
          </NavLink>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = '/login'
            }}
          >
            <LogOutIcon size={15} />
            退出登录
          </a>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="title">{TITLES[pathname] ?? '管理台'}</span>
          <div className="right">
            <span style={{ color: 'var(--text-3)', fontSize: 13 }}>
              管理员 · {currentUser.nickname}
            </span>
            <span className="avatar sm">{currentUser.nickname[0]}</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
