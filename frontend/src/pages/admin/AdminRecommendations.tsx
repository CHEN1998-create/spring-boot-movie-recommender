import { hotTags, recoLogs, strategyDist, adminOverview } from '../../data/admin'
import { CompassIcon, FlameIcon, SparkleIcon, UsersIcon } from '../../components/Icons'

/** 推荐概览页：推荐结果 / 热门标签 / 用户行为统计（PRD 页面 9） */
export default function AdminRecommendations() {
  const maxTagCount = Math.max(...hotTags.map((t) => t.count))

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
            <div className="s-value">1,284</div>
            <div className="s-trend trend-up">↑ 较昨日 +6.2%</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="s-icon" style={{ background: 'rgba(255,140,55,0.14)', color: 'var(--accent)' }}>
            <SparkleIcon size={19} />
          </span>
          <div className="s-body">
            <div className="s-label">推荐点击率</div>
            <div className="s-value">
              {adminOverview.recoCtr}
              <span className="unit">%</span>
            </div>
            <div className="s-trend trend-up">↑ 连续 3 日走高</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="s-icon" style={{ background: 'rgba(91,141,239,0.14)', color: 'var(--blue)' }}>
            <UsersIcon size={19} />
          </span>
          <div className="s-body">
            <div className="s-label">冷启动用户占比</div>
            <div className="s-value">
              {adminOverview.coldStartRate}
              <span className="unit">%</span>
            </div>
            <div className="s-trend trend-down">↓ 建议补充新手引导</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="s-icon" style={{ background: 'rgba(74,222,128,0.14)', color: 'var(--green)' }}>
            <FlameIcon size={19} />
          </span>
          <div className="s-body">
            <div className="s-label">平均推荐结果数</div>
            <div className="s-value">
              9.6<span className="unit">条</span>
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
              <span className="sub">近 7 日全部推荐请求</span>
            </h3>
          </div>
          <div className="panel-body">
            {strategyDist.map((s) => (
              <div className="dist-row" key={s.name}>
                <span className="d-name">{s.name}</span>
                <div className="d-track">
                  <div className="d-bar" style={{ width: `${s.value}%`, background: s.color }} />
                </div>
                <span className="d-val" style={{ color: s.color }}>
                  {s.value}%
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
            <div className="rank-list">
              {hotTags.map((t, i) => (
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
          <span className="badge badge-gray">今日 1,284 条</span>
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
              {recoLogs.map((log) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
