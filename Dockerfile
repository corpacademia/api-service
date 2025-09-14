FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install  # ✅ install everything, not just production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
