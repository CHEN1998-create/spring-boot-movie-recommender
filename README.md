# 片屿 FilmIsle · 电影推荐系统

基于 Spring Boot + React 的全栈电影推荐社区。用户通过评分与收藏沉淀口味档案，系统基于多策略推荐算法（标签偏好 / 相似口味 / 热门冷启动）生成带推荐理由的个性化片单，并提供管理后台维护电影数据、查看推荐效果。

## 线上演示

> **演示链接**：<https://capture-speaks-improvement-memo.trycloudflare.com>
>
> （Cloudflare 免费隧道，依赖演示机开机运行；隧道重启后链接会变化，可用下方「本地运行」10 分钟自建）

- 演示账号（管理员）：`demo@filmisle.cn` / `demo123456`
- 后台入口：`/admin`（仅 ADMIN 角色）

## 功能一览

| 模块 | 说明 |
|---|---|
| 电影库 | 18 部种子电影，搜索、标签筛选、多维度排序、详情页 |
| 评分收藏 | 10 分制评分、收藏/取消收藏，实时更新口味档案 |
| 个性化推荐 | 多策略融合（标签匹配 60% + 口味相近用户 25% + 热门 15%），每条推荐附推荐理由与匹配分；已看自动过滤、冷启动降级 |
| 推荐效果统计 | 推荐展示/点击埋点（同人同片每日去重）、CTR、策略命中分布、冷启动占比 |
| 管理后台 | 电影数据维护（增改下架、标签管理）、数据看板、推荐效果概览 |
| 认证与安全 | JWT 登录注册（HS256 + BCrypt），管理接口强制 JWT，401/403 分层 |

## 技术栈

- **后端**：Java 17 · Spring Boot 3.3.5 · Spring Data JPA · H2 文件库 · jjwt · spring-security-crypto(BCrypt)
- **前端**：React 18 · TypeScript · Vite · 原生 CSS（无 UI 框架）
- **部署**：前后端一体化（后端托管前端产物 + SPA 回落），Dockerfile 多阶段构建，适配 Render/Zeabur/Koyeb 等平台

## 快速开始

### 方式一：前后端分离开发

```bash
# 后端（8080）
cd backend && mvn spring-boot:run

# 前端（5173，已配置代理到 8080）
cd frontend && npm install && npm run dev
```

### 方式二：一体化运行（单端口 8080）

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

云平台（Render / Zeabur / Koyeb）部署步骤见 [DEPLOY.md](./DEPLOY.md)。

### 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PORT` | 8080 | 监听端口 |
| `DB_PATH` | `./data/filmisle` | H2 文件库路径（首次启动自动建库并写入种子数据） |
| `STATIC_DIR` | `./public` | 前端构建产物目录 |
| `JWT_SECRET` | 演示默认值 | JWT 签名密钥（生产必须覆盖） |

## API 概览

```
POST /api/auth/register | /api/auth/login     # 注册 / 登录（返回 JWT）
GET  /api/auth/me                             # 当前用户
GET  /api/movies                              # 电影列表（搜索/标签/排序/分页）
GET  /api/movies/:id                          # 电影详情
GET  /api/tags                                # 标签列表
PUT  /api/ratings/:movieId                    # 评分
POST /api/favorites/:movieId | DELETE         # 收藏 / 取消收藏
GET  /api/ratings/me | /api/favorites         # 我的评分 / 收藏
GET  /api/recommendations                     # 个性化推荐（含理由与匹配分）
POST /api/recommendations/:movieId/click      # 推荐点击上报（幂等）
GET  /api/stats/overview                      # 公开站点统计
GET  /api/admin/stats                         # 管理看板（ADMIN）
POST /api/admin/movies | PATCH | DELETE       # 电影维护（ADMIN，强制 JWT）
```

## 推荐算法

综合得分 = `0.6 × 标签偏好匹配 + 0.25 × 口味相近用户协同 + 0.15 × 热门度`

- 标签偏好：用户历史高分电影的标签加权分布
- 协同信号：与当前用户评分向量夹角最小的用户的高分片
- 冷启动：评分/收藏不足时自动降级为热门推荐，并在响应中标注策略
- 每条推荐附带人类可读的推荐理由（如「与你高分的《xx》同属科幻悬疑」）

## 项目结构

```
├── PRD (1).md          # 产品需求文档
├── DEPLOY.md           # 云平台部署指引
├── Dockerfile          # 一体化镜像（前端构建 + 后端构建 + JRE 运行）
├── backend/            # Spring Boot（按 user/movie/rating/favorite/recommend/admin/stats/auth 分包）
└── frontend/           # React + Vite（pages / layouts / components / api）
```

## 文档

- [产品需求文档 PRD](./PRD%20(1).md)
- [部署指引](./DEPLOY.md)
