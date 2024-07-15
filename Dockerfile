FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --chown=node:node . .

RUN npm run build

EXPOSE ${API_PORT:-3000}
ENV HOST=${API_HOST:-0.0.0.0} PORT=${API_PORT:-3000}

CMD ["npm", "start"]