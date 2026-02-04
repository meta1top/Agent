# 构建阶段
FROM node:24-alpine AS builder

# 安装 pnpm（版本需与 lockfile 兼容）
RUN npm install -g pnpm@10

WORKDIR /app

# 第一步：只复制依赖文件（利用 Docker 缓存层）
# 只有当依赖文件变化时，才会重新安装依赖
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY libs ./libs
COPY locales ./locales
COPY packages/common ./packages/common

# 安装所有依赖（包括开发依赖，用于构建）
# 这一步会被缓存，除非上面的依赖文件发生变化
RUN pnpm install --frozen-lockfile

# 第二步：复制构建配置文件
COPY tsconfig.json tsconfig.build.json tsconfig.web.json ./

# 第三步：复制源代码（代码变化不会触发依赖重新安装）
COPY apps/web ./apps/web

ENV NODE_ENV=production

# 构建应用
# Next.js standalone 模式会在 .next/standalone 下创建包含 node_modules 的独立结构
RUN pnpm build:web

# 运行阶段
FROM node:24-alpine AS runner

# 安装 pm2（用于进程管理）
RUN npm install -g pm2

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# 从构建阶段复制 standalone 输出
# Next.js standalone 模式会在 .next/standalone 下创建包含 node_modules 的独立结构
# 复制整个 standalone 目录结构（包含根目录的 node_modules）
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
# 复制静态资源到应用目录内的正确位置
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
# 复制 public 目录
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# 设置工作目录为应用目录（server.js 所在位置）
WORKDIR /app/apps/web

# 切换到非 root 用户
USER nextjs

# 暴露端口（默认 3110，可通过环境变量覆盖）
EXPOSE 3110

# 设置环境变量，确保生产环境模式
ENV NODE_ENV=production
ENV PORT=3110

# 使用 pm2 运行应用
# 工作目录设置为 /app/apps/web，执行 server.js
# Next.js standalone 模式的路径逻辑：
# - 生产环境工作目录：/app/apps/web
# - server.js: Next.js standalone 模式生成的服务器入口文件
# - 静态资源：已复制到 ./apps/web/.next/static
# - public 资源：已复制到 ./apps/web/public
# pm2-runtime 会保持容器运行，并在应用崩溃时自动重启
CMD ["pm2-runtime", "start", "server.js", "--name", "wiki-web"]

