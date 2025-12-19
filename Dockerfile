# Stage 1: build / install dependencies
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: runtime image
FROM node:18-alpine
WORKDIR /usr/src/app

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
USER appuser
EXPOSE 3000
CMD ["node", "src/index.js"]