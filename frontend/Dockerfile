FROM node:20.3.1 as development
LABEL authors="maytav"

WORKDIR /app
COPY package*.json ./
COPY tsconfig.app.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4200

FROM node:20.3.1 as production

ARG NODE_ENV=Production
WORKDIR /app
COPY package*.json ./
ENV PORT=4000
ENV NODE_ENV=${NODE_ENV}
RUN npm install
COPY --from=development /app/dist ./dist
EXPOSE ${PORT}

CMD ["npm", "run", "start"]
