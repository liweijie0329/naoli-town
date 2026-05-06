FROM node:22-alpine

WORKDIR /app
COPY package.json ./
COPY server.mjs index.html app.js styles.css ./
COPY docs ./docs

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=10000
ENV DATA_DIR=/data

EXPOSE 10000

CMD ["node", "server.mjs"]
