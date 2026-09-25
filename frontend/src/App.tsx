import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout'
import AdminLayout from './layouts/AdminLayout'
import HomePage from './pages/HomePage'
import MovieListPage from './pages/MovieListPage'
import MovieDetailPage from './pages/MovieDetailPage'
import RecommendationsPage from './pages/RecommendationsPage'
import MePage from './pages/MePage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMovies from './pages/admin/AdminMovies'
import AdminRecommendations from './pages/admin/AdminRecommendations'

/**
 * 单 SPA 路由结构：
 * - 前台（用户侧）挂在 SiteLayout 下
 * - 后台（管理侧）按 PRD admin.xxx.com 用 /admin 前缀挂在 AdminLayout 下
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
          <Route path="/me" element={<MePage />} />
        </Route>

        {/* 后台 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="recommendations" element={<AdminRecommendations />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
