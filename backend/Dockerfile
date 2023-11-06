FROM node:20.3.1 as develpment
LABEL authors="maytav"

WORKDIR /app
COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000


FROM node:20.3.1 as production

ARG NODE_ENV=Production
WORKDIR /app
COPY package*.json ./
ENV PORT=3000
ENV NODE_ENV=${NODE_ENV}
RUN npm install
COPY --from=develpment /app/dist ./dist
EXPOSE ${PORT}

CMD ["npm", "run", "start"]