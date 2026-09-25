import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FilmIcon } from '../components/Icons'

/** 登录 / 注册页（PRD 页面 2，骨架阶段仅前端模拟） */
export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const navigate = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 接 POST /api/auth/login 或 /api/auth/register，JWT 存储后跳转
    navigate('/me')
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Link to="/" className="brand">
          <span className="logo">
            <FilmIcon size={17} />
          </span>
          <span className="cn">片屿</span>
          <span className="en">FILMISLE</span>
        </Link>
        <h1>{mode === 'login' ? '欢迎回来' : '加入片屿'}</h1>
        <p className="sub">
          {mode === 'login' ? '登录后继续记录你的观影足迹' : '注册一个账号，开始建立你的口味档案'}
        </p>

        <form onSubmit={submit}>
          {mode === 'register' && (
            <div className="field">
              <label>昵称</label>
              <input
                placeholder="给自己起个名字"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>
          )}
          <div className="field">
            <label>邮箱</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>密码</label>
            <input
              type="password"
              placeholder="至少 6 位"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 6 }}>
            {mode === 'login' ? '登录' : '注册并登录'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>
              还没有账号？<a onClick={() => setMode('register')} href="#">立即注册</a>
            </>
          ) : (
            <>
              已有账号？<a onClick={() => setMode('login')} href="#">直接登录</a>
            </>
          )}
        </div>

        <div className="auth-demo">
          骨架演示：暂不对接后端，任意邮箱密码均可进入。
          <br />
          演示账号：<code>demo@filmisle.cn</code>（具备管理员权限，可访问 <code>/admin</code>）
        </div>
      </div>
    </div>
  )
}
