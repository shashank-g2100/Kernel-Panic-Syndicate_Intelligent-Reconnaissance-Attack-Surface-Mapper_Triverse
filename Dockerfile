# Base for both frontend and backend (full-stack Node.js)
FROM node:20-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build step
RUN npm run build

# Final production image
FROM node:20-slim
WORKDIR /app
COPY --from=base /app/package*.json ./
RUN npm install --production
COPY --from=base /app/dist ./dist
COPY --from=base /app/server.ts ./server.ts
COPY --from=base /app/tsconfig.json ./tsconfig.json

# Use tsx to run the server in production or compile to JS
RUN npm install -g tsx

EXPOSE 3000
ENV NODE_ENV=production
CMD ["tsx", "server.ts"]
