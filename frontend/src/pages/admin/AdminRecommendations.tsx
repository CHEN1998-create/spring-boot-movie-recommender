import { useEffect, useState } from 'react'
import { api } from '../../api'
import type { AdminStats } from '../../api'
import { CompassIcon, FlameIcon, SparkleIcon, UsersIcon } from '../../components/Icons'

const STRATEGY_COLOR: Record<string, string> = {
  标签偏好: '#ff8c37',
  热门加权: '#5b8def',
  冷启动补位: '#8f7bf3',
}

/** 推荐概览页：推荐效果 / 热门标签 / 推荐日志（PRD 页面 9，数据来自 GET /api/admin/stats） */
export default function AdminRecommendations() {
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
        <div className="icon">🧭</div>
        <p>推荐统计数据加载失败：{error}</p>
        <button className="btn btn-ghost" onClick={() => location.reload()} style={{ marginTop: 16 }}>
          重试
        </button>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="empty" style={{ padding: 48 }}>
        <div className="icon">🧭</div>
        <p>正在加载推荐概览…</p>
      </div>
    )
  }

  const s = stats
  const maxTagCount = Math.max(...s.hotTags.map((t) => t.count), 1)

  return (
    <>
      {/* 指标卡 */}
      <div className="stat-grid">
        <div className="stat-card">
          <span className="s-icon" style={{ background: 'rgba(143,123,243,0.14)', color: 'var(--purple)' }}>
            <CompassIcon size={19} />
          </span>
          <div className="s-body">
            <div className="s-label">今日推荐次数</div>
            <div className="s-value">{s.todayRecoCount.toLocaleString()}</div>
            <div className="s-trend trend-up">↑ 累计 {s.recoTotalCount.toLocaleString()} 次</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="s-icon" style={{ background: 'rgba(255,140,55,0.14)', color: 'var(--accent)' }}>
            <SparkleIcon size={19} />
          </span>
          <div className="s-body">
            <div className="s-label">推荐点击率</div>
            <div className="s-value">
              {s.recoCtr}
              <span className="unit">%</span>
            </div>
            <div className="s-trend trend-up">↑ 累计 {s.recoClickCount} 次点击 / 展示条数</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="s-icon" style={{ background: 'rgba(91,141,239,0.14)', color: 'var(--blue)' }}>
            <UsersIcon size={19} />
          </span>
          <div className="s-body">
            <div className="s-label">冷启动用户占比</div>
            <div className="s-value">
              {s.coldStartRate}
              <span className="unit">%</span>
            </div>
            <div className="s-trend trend-down">评分 &lt; 3 条的用户</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="s-icon" style={{ background: 'rgba(74,222,128,0.14)', color: 'var(--green)' }}>
            <FlameIcon size={19} />
          </span>
          <div className="s-body">
            <div className="s-label">平均推荐结果数</div>
            <div className="s-value">
              {s.avgResultCount}
              <span className="unit">条</span>
            </div>
            <div className="s-trend trend-up">↑ 达标（≥10 或最大可用值）</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* 策略分布 */}
        <div className="panel">
          <div className="panel-head">
            <h3>
              推荐策略命中分布
              <span className="sub">recommendation_logs 表按策略聚合</span>
            </h3>
          </div>
          <div className="panel-body">
            {s.strategyDist.map((d) => (
              <div className="dist-row" key={d.strategy}>
                <span className="d-name">{d.strategy}</span>
                <div className="d-track">
                  <div
                    className="d-bar"
                    style={{ width: `${d.percent}%`, background: STRATEGY_COLOR[d.strategy] ?? '#8f7bf3' }}
                  />
                </div>
                <span className="d-val" style={{ color: STRATEGY_COLOR[d.strategy] ?? '#8f7bf3' }}>
                  {d.percent}%
                </span>
              </div>
            ))}
            <p style={{ color: 'var(--text-3)', fontSize: 12.5, marginTop: 16, lineHeight: 1.7 }}>
              一级策略为标签偏好（用户偏好标签 ∩ 影片标签）；当结果不足 10 条时，以热门加权补位；新注册用户走冷启动补位。
            </p>
          </div>
        </div>

        {/* 热门标签 */}
        <div className="panel">
          <div className="panel-head">
            <h3>
              热门标签 Top 10
              <span className="sub">按被评分 / 收藏次数聚合</span>
            </h3>
          </div>
          <div className="panel-body">
            {s.hotTags.length === 0 ? (
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>暂无行为数据，产生评分 / 收藏后自动聚合</p>
            ) : (
              <div className="rank-list">
                {s.hotTags.map((t, i) => (
                  <div className="rank-item" key={t.tag}>
                    <span className="no">{i + 1}</span>
                    <span className="tag-name">{t.tag}</span>
                    <div className="track">
                      <i style={{ width: `${(t.count / maxTagCount) * 100}%` }} />
                    </div>
                    <span className="cnt">{t.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 最近推荐日志 */}
      <div className="panel">
        <div className="panel-head">
          <h3>
            最近推荐日志
            <span className="sub">recommendation_logs 表 · 每次请求落一条</span>
          </h3>
          <span className="badge badge-gray">今日 {s.todayRecoCount} 条</span>
        </div>
        <div className="panel-body flush">
          <table className="table">
            <thead>
              <tr>
                <th>日志 ID</th>
                <th>用户</th>
                <th>策略</th>
                <th>结果数</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              {s.recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-3)' }}>
                    暂无推荐日志
                  </td>
                </tr>
              ) : (
                s.recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td>#{log.id}</td>
                    <td style={{ color: 'var(--text)' }}>{log.userName}</td>
                    <td>
                      <span
                        className={`badge ${
                          log.strategy === '标签偏好'
                            ? 'badge-orange'
                            : log.strategy === '热门加权'
                              ? 'badge-blue'
                              : 'badge-purple'
                        }`}
                      >
                        {log.strategy}
                      </span>
                    </td>
                    <td>{log.resultCount} 条</td>
                    <td>{log.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
