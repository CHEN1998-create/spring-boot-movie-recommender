# 片屿 FilmIsle · 电影推荐系统

> 记录你的每一部观影，让好电影找到对的人。评分与收藏沉淀为口味档案，推荐随你成长——且每一条推荐都说得出理由。

基于 **Spring Boot 3 + React 18** 的全栈电影推荐社区：多策略可解释推荐算法、前后端一体化部署、JWT 认证、管理员后台与推荐效果统计。

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-5-646cff) ![H2](https://img.shields.io/badge/H2-file%20DB-lightgrey)

## 在线演示

| 项目 | 内容 |
|---|---|
| 演示地址 | 暂未开放（可用下方「快速开始」在本地拉起完整站点） |
| 演示账号 | `demo@filmisle.cn` / `demo123456`（管理员，可进 `/admin`） |
| 建议动线 | 注册新账号 → 给 3 部片评分 → 看「为你推荐」变化 → 登录 demo 进后台看统计 |

> 演示链接由 Cloudflare 免费隧道提供，依赖演示机开机运行；隧道重启后域名会变。随时可用下方「快速开始」在本地 10 分钟拉起完整站点。

## 功能特性

### 前台（游客可浏览，操作需登录）

- **电影库**：18 部精选种子影片，关键词搜索、15 类标签筛选、按综合评分/最新上映/评分人数排序、分页
- **电影详情**：海报、导演主演、片长地区、平台均分与人数、剧情简介；评分与收藏在此完成
- **评分收藏**：10 分制五星评分（实时换算展示「7 分·推荐」档位文案），收藏/取消收藏即时生效
- **个性化推荐**：Top 10 推荐位，每条附带**推荐理由**（如「与你高分的《让子弹飞》同属喜剧犯罪」）与匹配徽章（标签偏好 / 热门精选 / 冷启动）；已评分、已收藏影片自动过滤
- **个人中心**：我的评分 / 我的收藏双列表，删评分、取消收藏直达

### 管理后台（仅 ADMIN，强制 JWT）

- **数据看板**：电影总数、收藏率、冷启动占比、近 7 日评分趋势、策略命中分布、热门标签 Top 10、推荐点击率（CTR，真实埋点）
- **电影维护**：新增（10 字段表单、空海报使用本地通用占位图）、编辑、搜索分页、下架
- **推荐概览**：今日推荐次数、CTR、冷启动占比、平均推荐条数、策略分布与最近推荐日志

### 认证与安全

- 注册 / 登录（JWT HS256，7 天有效期）、密码 BCrypt 散列存储
- 管理接口**只认 JWT**：无 token 401、非管理员 403、身份无效 401
- 前端路由守卫（`/me` 需登录、`/admin` 需管理员）+ 401 自动跳登录页（带回跳地址）
- 推荐点击埋点同人同片每日去重，防刷新虚增 CTR

## 系统架构

```
┌────────────────────────── 单容器 / 单域名（一体化部署）──────────────────────────┐
│                                                                                │
│  React 18 + TS (Vite build → /public)          Spring Boot 3.3.5 (:8080)       │
│  ┌───────────────────────────┐   同域 fetch    ┌──────────────────────────────┐ │
│  │ pages/  首页·电影库·详情   │ ─────────────→ │ JwtAuthInterceptor (Bearer)  │ │
│  │         推荐·个人中心      │                │   ├─ 无 token → 游客/demo 回落│ │
│  │         /admin 后台×3     │                │   └─ /api/admin/** 强制 JWT  │ │
│  │ api.ts  fetch 封装+401自愈 │ ←───────────── │ @CurrentUser 参数解析        │ │
│  └───────────────────────────┘    JSON        ├──────────────────────────────┤ │
│        ▲  PathResourceResolver               │ movie / rating / favorite    │ │
│        └─ SPA 回落：非 API 路由 → index.html   │ recommend / auth / admin     │ │
│                                              │ stats(公开+管理) / bootstrap │ │
│                                              └──────────┬───────────────────┘ │
│                                                         │ JPA                 │
│                                              ┌──────────▼───────────────────┐ │
│                                              │ H2 文件库（./data/filmisle）  │ │
│                                              │ ddl-auto:update + 种子器幂等  │ │
│                                              └──────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────┘
```

## 数据模型

| 表 | 关键字段 | 说明 |
|---|---|---|
| `users` | email(唯一)、nickname、password_hash、role(ADMIN/USER) | 用户；演示种子账号内置 |
| `movies` | title、original_title、release_year、duration、director、cast_names、region、summary、poster_url、**rating / rating_count(聚合冗余)** | 电影主表；评分写入时维护聚合 |
| `movie_tags` | movie_id、tag | 电影标签（一对多，`replaceTags` 幂等重建） |
| `ratings` | user_id、movie_id(唯一)、score(1-10) | 评分；upsert 语义 |
| `favorites` | user_id、movie_id(唯一) | 收藏 |
| `recommendation_logs` | user_id、strategy、item_count、created_at | 每次推荐生成留痕（策略=结果集主导策略） |
| `recommendation_clicks` | user_id、movie_id、clicked_at | 点击埋点（同人同片每日一条） |

首次启动自动执行种子器：18 部电影 + 15 个标签 + demo 账号 + 演示行为数据，全部**幂等**（重复启动不重复插入）。

## 推荐算法（可解释推荐 v1）

**行为画像**

- 评分 ≥ 7 视为正向信号，权重 `(score − 6) / 4`（7→0.25、8→0.5、9→0.75、10→1.0）
- 收藏视为强正向信号，权重 1.0；同片多信号取较大值
- 正向行为影片的标签累加，得到用户「标签偏好权重表」

**候选打分**（0-1 归一化，已排除用户评过/收藏过的影片）

```
score = 0.62 × 标签匹配度 + 0.25 × 影片质量(均分/10) + 0.13 × 热度(log 评分人数归一)
```

**策略分级**（与前端徽章一一对应）

| 条件 | 策略 | 表现 |
|---|---|---|
| 行为记录 < 3 条 | `cold-start` 冷启动 | 按站内口碑补位，响应中明确标注 |
| 标签匹配度 > 0 | `tag` 标签偏好（主策略） | 推荐理由引用用户高分/收藏影片 |
| 其余 | `hot` 热门加权 | 站内口碑兜底 |

每次生成写入 `recommendation_logs`，TopN = 10（或当前可用最大值）。**可解释性**是第一优先级：推荐理由由命中的偏好标签 + 参照影片实时生成，而非文案模板随机抽取。

## API 一览

| 方法 | 路径 | 权限 | 说明 |
|---|---|---|---|
| POST | `/api/auth/register` | 公开 | 注册（邮箱唯一，重复 409），返回 JWT |
| POST | `/api/auth/login` | 公开 | 登录（密码错误 401），返回 JWT + 用户 |
| GET | `/api/auth/me` | 登录 | 当前用户信息 |
| GET | `/api/movies` | 公开 | 电影列表（keyword/tags/sort/page） |
| GET | `/api/movies/:id` | 公开 | 电影详情（含当前用户评分收藏态） |
| GET | `/api/tags` | 公开 | 标签列表 |
| PUT | `/api/ratings/:movieId` | 登录 | 评分（1-10，upsert） |
| DELETE | `/api/ratings/:movieId` | 登录 | 删除评分 |
| POST / DELETE | `/api/favorites/:movieId` | 登录 | 收藏 / 取消收藏 |
| GET | `/api/ratings/me`、`/api/favorites` | 登录 | 我的评分 / 我的收藏 |
| GET | `/api/recommendations` | 登录 | 个性化推荐（含理由、匹配分、策略徽章、画像摘要） |
| POST | `/api/recommendations/:movieId/click` | 登录 | 推荐点击上报（同人同片每日幂等） |
| GET | `/api/stats/overview` | 公开 | 站点规模统计（电影数/用户数/评分数等） |
| GET | `/api/admin/stats` | ADMIN | 管理看板全部指标（PRD 6.1） |
| POST | `/api/admin/movies` | ADMIN | 新增电影 |
| PATCH | `/api/admin/movies/:id` | ADMIN | 编辑 / 上下架 |
| DELETE | `/api/admin/movies/:id` | ADMIN | 删除电影 |

统一错误格式：`{ "status": 4xx, "message": "..." }`；401=身份无效（未带/伪造/过期 token），403=身份有效但权限不足。

## 快速开始

### 方式一：前后端分离开发

```bash
# 后端（8080）—— 需要 JDK 17 + Maven
cd backend && mvn spring-boot:run

# 前端（5173，已配置代理到 8080）—— 需要 Node 18+
cd frontend && npm install && npm run dev
```

### 方式二：一体化运行（单端口 8080，无 CORS）

```bash
cd frontend && npm run build && cp -r dist ../backend/public
cd ../backend && mvn package -DskipTests && java -jar target/filmisle-backend-0.0.1-SNAPSHOT.jar
# 打开 http://localhost:8080
```

### 方式三：Docker

```bash
docker build -t filmisle .
docker run -p 8080:8080 -e JWT_SECRET=your-secret-at-least-32-bytes filmisle
```

云平台（Render / Zeabur / Koyeb）一键部署步骤见 [DEPLOY.md](./DEPLOY.md)；也可用 `cloudflared tunnel --url http://localhost:8080` 一条命令获得临时公网链接（本仓库演示链接即此方案）。

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PORT` | 8080 | 监听端口（容器平台注入自动生效） |
| `DB_PATH` | `./data/filmisle` | H2 文件库路径，容器挂卷时指向卷内 |
| `STATIC_DIR` | `./public` | 前端构建产物目录（Docker 阶段已放入） |
| `JWT_SECRET` | 演示默认值 | JWT 签名密钥，**生产/公网部署必须覆盖**（≥32 字节） |

## 技术决策记录

| 决策 | 理由 |
|---|---|
| H2 文件库而非 MySQL | 零安装、随仓库走、`ddl-auto:update` 自动迁移；文件路径配置化（`DB_PATH`）后可无缝挂卷持久化，平滑升级 MySQL 仅需换依赖与连接串 |
| jjwt + 手写拦截器，不引入完整 Spring Security | 只需要「验证 token → 注入用户 → 角色校验」管线，完整 Security 过滤链对单体验项目过重；`spring-security-crypto` 仅引入 BCrypt 一个类 |
| 前后端一体化（后端托管前端产物） | 单容器单域名：免 CORS、免独立静态托管，任何 Java PaaS 均可部署；`PathResourceResolver` 实现 SPA 回落，前端路由刷新不 404 |
| 身份回落 demo（无 token 时） | 游客可浏览全站，未登录也能体验推荐（回落演示档案）；携带 token 则严格按真实身份，管理端强制 JWT 杜绝伪造头越权 |
| 推荐理由实时生成 | 「为什么推荐给我」是核心产品价值（PRD 第 7 节），理由引用用户真实高分影片与命中标签，算法可信度可见 |
| 图片资产本地化 | 19 张海报/占位图内置于 `frontend/public/posters/`，不依赖外部文生图服务，断网环境演示可用 |

## 测试与验证

端到端场景已在真实浏览器验证通过：

1. **浏览 → 评分 → 收藏 → 推荐变化**：新行为落库后，推荐列表发生重排、推荐理由引用新评分影片、画像摘要计数更新
2. **管理员 → 添加电影 → 推荐统计**：新增影片进入电影库，看板指标与推荐概览同步更新，测试数据可经 UI 下架清理
3. **权限矩阵**：伪造身份 401 / 普通用户访问管理接口 403 / 管理员 200 / 游客可浏览（12 项用例）
4. **多账号隔离**：新注册用户与 demo 档案互不可见，推荐独立生成

## 项目结构

```
├── PRD (1).md              # 产品需求文档
├── DEPLOY.md               # 云平台部署指引（平台对比 + 步骤）
├── Dockerfile              # 三阶段构建：node 构建前端 → maven 构建 → JRE 运行
├── backend/
│   └── src/main/java/cn/filmisle/
│       ├── auth/           # JWT 签发校验 / 登录注册 / 拦截器 / @CurrentUser
│       ├── user/           # 用户实体 / 身份解析 / AdminGuard
│       ├── movie/          # 电影 + 标签（公开读 / 管理端写）
│       ├── rating/         # 评分（upsert + 聚合维护）
│       ├── favorite/       # 收藏
│       ├── recommend/      # 推荐引擎 / 推荐日志 / 点击埋点
│       ├── admin/          # 管理统计聚合
│       ├── stats/          # 公开统计 + CTR 口径
│       ├── common/         # 统一错误 / 全局异常处理
│       └── bootstrap/      # 种子数据（幂等）
└── frontend/
    └── src/
        ├── pages/          # 首页 / 电影库 / 详情 / 推荐 / 个人中心 / 登录 / admin×3
        ├── components/     # MovieCard / RatingStars / Modal / Pagination / Icons
        ├── layouts/        # SiteLayout（前台）/ AdminLayout（后台）
        ├── api.ts          # fetch 封装（Bearer / 401 自愈 / 统一错误）
        └── data/           # 游客演示态兜底数据
```

## 迭代历程

1. 骨架搭建：Spring Boot + Vite 脚手架、H2 建模、种子数据、前端演示数据联调
2. 核心功能：电影库 / 详情 / 评分 / 收藏 / 个人中心接入真实接口
3. 推荐引擎：可解释推荐算法、推荐理由、策略徽章、冷启动降级
4. 管理后台：电影维护、数据看板、推荐概览全部接真实统计 + AdminGuard
5. 效果闭环：推荐点击埋点（每日幂等）、CTR 全链路真实、公开站点统计
6. 质量保障：两场景端到端浏览器测试、权限矩阵、数据一致性自检
7. 认证升级：JWT 注册登录、管理端强制 JWT、`X-User-Id` 演示机制退役、路由守卫
8. 部署上线：前后端一体化改造、Dockerfile、免费隧道公网发布
9. 图片本地化：19 张海报/占位图内置于前端静态资源，后端启动幂等迁移旧外部 URL

## 已知限制与后续规划

| 项 | 现状 | 规划 |
|---|---|---|
| 数据持久化 | H2 文件库，容器重启（未挂卷）回到种子态 | 挂持久卷或迁移 MySQL/Postgres |
| 演示隧道 | 依赖本机开机，链接随隧道重启变化 | Render 付费档 / 自有服务器固定域名 |
| 协同过滤 | v1 以标签偏好为主策略，未引入用户相似度矩阵 | 基于评分向量的近似协同项 |
| Refresh Token | JWT 固定 7 天有效期 | 短期 access + refresh 轮换 |
| 影视数据 | 18 部内置种子影片 | 接入 TMDB 等开放数据源 |

## 文档

- [产品需求文档 PRD](./PRD%20(1).md)
- [部署指引 DEPLOY](./DEPLOY.md)
