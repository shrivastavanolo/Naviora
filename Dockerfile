FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm@9
RUN corepack enable

ARG NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm config set minimumReleaseAge 0
RUN pnpm install

COPY . .
RUN npx prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]