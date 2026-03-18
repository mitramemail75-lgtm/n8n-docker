FROM node:22-bullseye-slim

RUN apt-get update && apt-get install -y ca-certificates git python3 make g++ --no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN npm install -g n8n

ENV N8N_USER_FOLDER=/home/node

USER node
EXPOSE 5678
CMD ["n8n", "start"]
