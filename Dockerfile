FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm@9
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set minimumReleaseAge 0
RUN pnpm config set ignore-scripts false
RUN pnpm config set onlyBuiltDependencies "@prisma/client prisma sharp"
RUN pnpm install
RUN npx prisma generate
COPY . .
RUN pnpm build
EXPOSE 3000

CMD ["pnpm", "start"]