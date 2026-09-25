import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout'
import AdminLayout from './layouts/AdminLayout'
import { getToken, getSessionUser } from './api'
import HomePage from './pages/HomePage'
import MovieListPage from './pages/MovieListPage'
import MovieDetailPage from './pages/MovieDetailPage'
import RecommendationsPage from './pages/RecommendationsPage'
import MePage from './pages/MePage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMovies from './pages/admin/AdminMovies'
import AdminRecommendations from './pages/admin/AdminRecommendations'

/** 需登录守卫：无 token 跳登录页并携带回跳地址 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const next = encodeURIComponent(window.location.pathname + window.location.search)
  if (!getToken()) return <Navigate to={`/login?next=${next}`} replace />
  return <>{children}</>
}

/** 管理端守卫：需登录且角色为 ADMIN（PRD：管理接口与后台单独鉴权） */
function RequireAdmin() {
  if (!getToken() || !getSessionUser()) {
    return <Navigate to="/login?next=%2Fadmin" replace />
  }
  if (getSessionUser()?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }
  return <AdminLayout />
}

/**
 * 单 SPA 路由结构：
 * - 前台（用户侧）挂在 SiteLayout 下；/me 需登录
 * - 后台（管理侧）按 PRD admin.xxx.com 用 /admin 前缀挂在 AdminLayout 下，仅 ADMIN 可入
 * - /recommendations 保留游客演示态（回落演示画像，展示推荐效果）
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 前台 */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/movies" element={<MovieListPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route
            path="/me"
            element={
              <RequireAuth>
                <MePage />
              </RequireAuth>
            }
          />
        </Route>

        {/* 后台 */}
        <Route path="/admin" element={<RequireAdmin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="recommendations" element={<AdminRecommendations />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
