import { useEffect, useState } from 'react'
import { api } from '../../api'
import type { AdminStats } from '../../api'
import { ChartIcon, ClapperIcon, CompassIcon, FlameIcon, HeartIcon, UsersIcon } from '../../components/Icons'

/** 后台首页：电影总数 / 用户行为概览 / 推荐效果概览（PRD 页面 7，数据来自 GET /api/admin/stats） */
export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .adminStats()
      .then((s) => {
        if (!cancelled) setStats(s)
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div className="empty" style={{ padding: 48 }}>
        <div className="icon">📊</div>
        <p>统计数据加载失败：{error}</p>
        <button className="btn btn-ghost" onClick={() => location.reload()} style={{ marginTop: 16 }}>
          重试
        </button>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="empty" style={{ padding: 48 }}>
        <div className="icon">📊</div>
        <p>正在加载后台数据…</p>
      </div>
    )
  }

  const s = stats
  const weekTotal = s.weeklyRatings.reduce((acc, d) => acc + d.count, 0)
  const maxCount = Math.max(...s.weeklyRatings.map((d) => d.count), 1)

  return (
    <>
      {/* 指标卡 */}
      <div className="stat-grid">
        <StatCard icon={<ClapperIcon size={19} />} color="#ff8c37" label="电影总数" value={s.movieCount} trend="movies 表实时统计" trendUp />
        <StatCard icon={<UsersIcon size={19} />} color="#5b8def" label="注册用户" value={s.userCount.toLocaleString()} trend="users 表实时统计" trendUp />
        <StatCard icon={<ChartIcon size={19} />} color="#4ade80" label="今日评分数" value={s.todayRatingCount} trend={`累计 ${s.ratingCount} 条`} trendUp />
        <StatCard icon={<HeartIcon size={19} />} color="#f87171" label="收藏率" value={s.favoriteRate} unit="%" trend={`收藏过影片的用户 · 共 ${s.favoriteCount} 次收藏`} trendUp />
        <StatCard icon={<CompassIcon size={19} />} color="#8f7bf3" label="推荐点击率" value={s.recoCtr} unit="%" trend={`推荐位曝光→点击 · 累计 ${s.recoClickCount} 次`} trendUp />
        <StatCard icon={<FlameIcon size={19} />} color="#ffb26b" label="冷启动用户占比" value={s.coldStartRate} unit="%" trend="评分 < 3 条的用户" />
      </div>

      {/* 近 7 日评分 */}
      <div className="panel">
        <div className="panel-head">
          <h3>
            近 7 日评分数
            <span className="sub">用户行为概览 · ratings 表按日聚合</span>
          </h3>
          <span className="badge badge-gray">近 7 日累计 {weekTotal} 条</span>
        </div>
        <div className="panel-body">
          <div className="bar-chart">
            {s.weeklyRatings.map((d) => (
              <div className="bar-col" key={d.day}>
                <div className="bar-wrap">
                  <div
                    className="bar"
                    style={{ height: `${(d.count / maxCount) * 100}%` }}
                    title={`${d.day}：${d.count} 条`}
                  >
                    <span className="val">{d.count}</span>
                  </div>
                </div>
                <span className="day">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 行为总量 + 待办提醒 */}
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <h3>行为总量</h3>
            <span className="sub">全站累计</span>
          </div>
          <div className="panel-body">
            <TotalRow label="累计评分" value={`${s.ratingCount} 条`} color="#4ade80" />
            <TotalRow label="累计收藏" value={`${s.favoriteCount} 次`} color="#f87171" />
            <TotalRow label="今日评分" value={`${s.todayRatingCount} 条`} color="#5b8def" />
            <TotalRow label="今日推荐次数" value={`${s.todayRecoCount} 次（累计 ${s.recoTotalCount}）`} color="#8f7bf3" />
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <h3>运营提示</h3>
          </div>
          <div className="panel-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-2)', fontSize: 13.5 }}>
                <span className="badge badge-orange">推荐</span>
                {s.coldStartRate >= 30
                  ? `冷启动占比 ${s.coldStartRate}%，建议上线新手引导评分`
                  : `冷启动占比 ${s.coldStartRate}%，处于健康区间`}
              </li>
              <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-2)', fontSize: 13.5 }}>
                <span className="badge badge-blue">内容</span>
                {s.avgResultCount >= 10
                  ? '平均推荐结果数达标（≥10 条），可考虑扩充片库提升多样性'
                  : `平均推荐结果数 ${s.avgResultCount} 条，片库偏小，建议补充影片`}
              </li>
              <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-2)', fontSize: 13.5 }}>
                <span className="badge badge-green">策略</span>
                {s.strategyDist[0] && s.strategyDist[0].count > 0
                  ? `主策略「${s.strategyDist[0].strategy}」命中 ${s.strategyDist[0].percent}%，策略运行正常`
                  : '暂无推荐日志，访问一次推荐页即可生成'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

function StatCard({
  icon,
  color,
  label,
  value,
  unit,
  trend,
  trendUp,
}: {
  icon: React.ReactNode
  color: string
  label: string
  value: number | string
  unit?: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <div className="stat-card">
      <span className="s-icon" style={{ background: `${color}22`, color }}>
        {icon}
      </span>
      <div className="s-body">
        <div className="s-label">{label}</div>
        <div className="s-value">
          {value}
          {unit && <span className="unit">{unit}</span>}
        </div>
        {trend && (
          <div className={`s-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
    </div>
  )
}

function TotalRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--text-2)' }}>
        <i style={{ width: 8, height: 8, borderRadius: 99, background: color, display: 'inline-block' }} />
        {label}
      </span>
      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{value}</span>
    </div>
  )
}
