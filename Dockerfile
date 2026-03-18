FROM node:22-bullseye-slim

RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-freefont-ttf \
    git \
    python3 \
    make \
    g++ \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g n8n

RUN mkdir -p /home/node/.n8n/nodes && \
    cd /home/node/.n8n/nodes && \
    npm init -y && \
    npm install n8n-nodes-puppeteer puppeteer-extra-plugin-user-data-dir puppeteer-extra-plugin-user-preferences --legacy-peer-deps && \
    chown -R node /home/node/.n8n

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_FUNCTION_ALLOW_EXTERNAL=puppeteer,puppeteer-extra,puppeteer-extra-plugin-stealth
ENV N8N_COMMUNITY_PACKAGES_ENABLED=true

USER node
EXPOSE 5678
CMD ["n8n", "start"]
