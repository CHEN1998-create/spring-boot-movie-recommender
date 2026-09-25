import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { heroBackdrop, hotMovies, recentMovies, ALL_TAGS } from '../data/movies'
import { adminOverview } from '../data/admin'
import {
  ArrowRightIcon,
  ClapperIcon,
  CompassIcon,
  FlameIcon,
  HeartIcon,
  SparkleIcon,
} from '../components/Icons'

/** 官网 / 用户前台首页：产品介绍 + 热门电影 + 注册入口（PRD 页面 1） */
export default function HomePage() {
  return (
    <>
      {/* 主视觉 */}
      <section className="hero">
        <div className="backdrop">
          <img src={heroBackdrop} alt="" />
        </div>
        <div className="inner container">
          <span className="kicker">
            <SparkleIcon size={14} />
            口味驱动的电影推荐社区 · MVP 上线
          </span>
          <h1>
            看过的每一部片，
            <br />
            都在帮你找到
            <em>下一部好片</em>
          </h1>
          <p>
            在片屿评分、收藏、写下你的口味。推荐引擎根据你的偏好标签给出 TopN
            结果——并且告诉你，它为什么推荐。
          </p>
          <div className="actions">
            <Link to="/login" className="btn btn-primary btn-lg">
              免费注册，开始记录
            </Link>
            <Link to="/movies" className="btn btn-lg">
              先随便逛逛
            </Link>
          </div>
          <div className="stats">
            <div className="stat">
              <b>{adminOverview.movieCount}</b>
              <span>在库电影</span>
            </div>
            <div className="stat">
              <b>{adminOverview.userCount.toLocaleString()}</b>
              <span>注册岛民</span>
            </div>
            <div className="stat">
              <b>{adminOverview.todayRatingCount}</b>
              <span>今日评分</span>
            </div>
            <div className="stat">
              <b>{adminOverview.recoCtr}%</b>
              <span>推荐点击率</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container page">
        {/* 热门榜 */}
        <section style={{ marginBottom: 44 }}>
          <div className="rail-head">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FlameIcon size={20} style={{ color: 'var(--accent)' }} />
              本周热门榜
            </h2>
            <Link to="/movies" className="more">
              查看全部 <ArrowRightIcon size={13} />
            </Link>
          </div>
          <div className="rail">
            {hotMovies.map((m, i) => (
              <MovieCard key={m.id} movie={m} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* 最新入库 */}
        <section style={{ marginBottom: 44 }}>
          <div className="rail-head">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClapperIcon size={19} style={{ color: 'var(--blue)' }} />
              最新入库
            </h2>
            <Link to="/movies" className="more">
              查看全部 <ArrowRightIcon size={13} />
            </Link>
          </div>
          <div className="rail">
            {recentMovies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>

        {/* 产品卖点 */}
        <section style={{ marginBottom: 44 }}>
          <div className="feature-row">
            <div className="feature">
              <span
                className="icon"
                style={{ background: 'rgba(248,113,113,0.12)', color: 'var(--red)' }}
              >
                <HeartIcon size={20} />
              </span>
              <h3>评分与收藏，沉淀你的口味</h3>
              <p>
                给电影打 1-10 分、一键收藏心水之作。每一次交互都在丰富你的个人档案，它们全部服务于推荐质量。
              </p>
            </div>
            <div className="feature">
              <span
                className="icon"
                style={{ background: 'rgba(255,140,55,0.13)', color: 'var(--accent)' }}
              >
                <CompassIcon size={20} />
              </span>
              <h3>可解释的推荐，而不是黑盒</h3>
              <p>
                每条推荐都附带推荐分值、命中的偏好标签和一句人话理由——「你近期给高分的科幻片较多，所以推了这部」。
              </p>
            </div>
            <div className="feature">
              <span
                className="icon"
                style={{ background: 'rgba(91,141,239,0.13)', color: 'var(--blue)' }}
              >
                <ClapperIcon size={20} />
              </span>
              <h3>内容后台持续上新</h3>
              <p>
                运营团队通过管理台维护影片、标签与推荐策略，热门榜单和推荐结果每日更新，冷启动用户也有热片兜底。
              </p>
            </div>
          </div>
        </section>

        {/* 标签云 CTA */}
        <section>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>从你喜欢的类型开始</h2>
              <p style={{ color: 'var(--text-3)', fontSize: 13.5 }}>
                点一个标签，看看这个类型里都有哪些值得看的片子
              </p>
            </div>
            <div className="tag-cloud" style={{ maxWidth: 560 }}>
              {ALL_TAGS.slice(0, 8).map((t) => (
                <Link key={t} to={`/movies?tag=${encodeURIComponent(t)}`} className="chip">
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
