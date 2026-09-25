# 部署指引（免费云托管）

片屿采用**前后端一体化**部署：前端构建产物由 Spring Boot 同域托管，单容器、单域名、无 CORS。

## 平台任选其一（认根目录 Dockerfile 自动构建）

| 平台 | 免费额度 | 特点 | 国内访问 |
|---|---|---|---|
| **Zeabur**（推荐） | 免费额度可跑 1 服务 | 中文界面，GitHub 登录即用 | 好 |
| Koyeb | 1 个免费 Web 服务（常驻） | 构建资源充足 | 一般 |
| Render | 免费 Web 服务 | 15 分钟无访问休眠，冷启动约 50s | 一般 |

## Zeabur 部署步骤

1. 打开 [zeabur.com](https://zeabur.com) → 用 GitHub 账号登录
2. Create Project → 选择区域（建议新加坡/东京）→ Add Service → Git → 选本仓库
3. Zeabur 自动识别根目录 `Dockerfile` 并构建（首次约 5-10 分钟）
4. 构建完成后 Networking → Generate Domain 生成免费公网域名
5. Variables 中添加环境变量：
   - `JWT_SECRET`：任意 32 字节以上随机字符串（**必须设置**，否则用默认演示密钥）
   - 其余（`PORT`/`DB_PATH`/`STATIC_DIR`）已有默认值，无需配置

## Koyeb / Render

同样是「连接 GitHub 仓库 → 检测 Dockerfile → 创建服务 → 绑定域名」，环境变量配置相同。

## 环境变量说明

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PORT` | 8080 | 监听端口，平台注入自动生效 |
| `DB_PATH` | `/data/filmisle`（容器内） | H2 文件库路径，挂持久卷时指向卷内 |
| `STATIC_DIR` | `./public` | 前端构建产物目录（Docker 阶段已放入） |
| `JWT_SECRET` | 演示默认值 | JWT 签名密钥，生产必须覆盖 |

## 免费档限制（须知）

- **数据重置**：不挂持久卷时，容器重启后 H2 数据回到种子状态（电影/评分/收藏/演示账号自动重建，演示不受影响）；Zeabur 挂载持久卷需付费额度
- **休眠/冷启动**：Render 15 分钟无访问休眠；Koyeb/Zeabur 视套餐而定
- **首次注册**：新注册的电影用户在重启后随库重置

## 本地一体化运行（验证用）

```bash
cd frontend && npm run build && cp -r dist ../backend/public
cd ../backend && mvn package -DskipTests && java -jar target/filmisle-backend-0.0.1-SNAPSHOT.jar
# 打开 http://localhost:8080 即完整站点（无需 5173）
```
