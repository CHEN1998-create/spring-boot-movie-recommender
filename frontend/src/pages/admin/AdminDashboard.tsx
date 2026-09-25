import { adminOverview, weeklyRatings } from '../../data/admin'
import { movies } from '../../data/movies'
import { ChartIcon, ClapperIcon, CompassIcon, FlameIcon, HeartIcon, UsersIcon } from '../../components/Icons'

/** 后台首页：电影总数 / 用户行为概览 / 推荐效果概览（PRD 页面 7） */
export default function AdminDashboard() {
  const maxCount = Math.max(...weeklyRatings.map((d) => d.count))
  const ratedMovies = new Set([1, 2, 3, 4, 5, 13]).size // 演示：有评分的电影数

  return (
    <>
      {/* 指标卡 */}
      <div className="stat-grid">
        <StatCard
          icon={<ClapperIcon size={19} />}
          color="#ff8c37"
          label="电影总数"
          value={adminOverview.movieCount}
          trend={`本周新增 6 部`}
          trendUp
        />
        <StatCard
          icon={<UsersIcon size={19} />}
          color="#5b8def"
          label="注册用户"
          value={adminOverview.userCount.toLocaleString()}
          trend="本周 +42"
          trendUp
        />
        <StatCard
          icon={<ChartIcon size={19} />}
          color="#4ade80"
          label="今日评分数"
          value={adminOverview.todayRatingCount}
          trend="较昨日 -10.4%"
        />
        <StatCard
          icon={<HeartIcon size={19} />}
          color="#f87171"
          label="收藏率"
          value={adminOverview.favoriteRate}
          unit="%"
          trend="浏览→收藏转化"
          trendUp
        />
        <StatCard
          icon={<CompassIcon size={19} />}
          color="#8f7bf3"
          label="推荐点击率"
          value={adminOverview.recoCtr}
          unit="%"
          trend="推荐位曝光→点击"
          trendUp
        />
        <StatCard
          icon={<FlameIcon size={19} />}
          color="#ffb26b"
          label="冷启动用户占比"
          value={adminOverview.coldStartRate}
          unit="%"
          trend="评分 < 3 条的用户"
        />
      </div>

      {/* 近 7 日评分 */}
      <div className="panel">
        <div className="panel-head">
          <h3>
            近 7 日评分数
            <span className="sub">用户行为概览 · ratings 表按日聚合</span>
          </h3>
          <span className="badge badge-gray">累计 570 条</span>
        </div>
        <div className="panel-body">
          <div className="bar-chart">
            {weeklyRatings.map((d) => (
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

      {/* 内容健康度 */}
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <h3>内容健康度</h3>
          </div>
          <div className="panel-body">
            <DistRow
              name="评分覆盖率"
              value={Math.round((ratedMovies / movies.length) * 100)}
              color="#4ade80"
              hint={`${ratedMovies}/${movies.length} 部有评分`}
            />
            <DistRow name="海报完整率" value={100} color="#5b8def" hint="全部影片已配图" />
            <DistRow name="标签覆盖率" value={100} color="#8f7bf3" hint="全部影片 ≥1 个标签" />
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <h3>待办提醒</h3>
          </div>
          <div className="panel-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-2)', fontSize: 13.5 }}>
                <span className="badge badge-orange">内容</span>
                「国产科幻」专题缺失 2 部影片资料
              </li>
              <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-2)', fontSize: 13.5 }}>
                <span className="badge badge-blue">推荐</span>
                冷启动占比 18.5%，建议上线新手引导评分
              </li>
              <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-2)', fontSize: 13.5 }}>
                <span className="badge badge-green">指标</span>
                推荐点击率连续 3 日高于 30%，策略运行健康
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

function DistRow({ name, value, color, hint }: { name: string; value: number; color: string; hint: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{name}</span>
        <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{hint}</span>
      </div>
      <div className="dist-row" style={{ marginBottom: 0 }}>
        <div className="d-track">
          <div className="d-bar" style={{ width: `${value}%`, background: color }} />
        </div>
        <span className="d-val" style={{ color }}>
          {value}%
        </span>
      </div>
    </div>
  )
}
