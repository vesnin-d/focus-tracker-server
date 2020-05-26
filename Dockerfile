FROM node:12-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
EXPOSE 8080
ENV NODE_ENV production
CMD ["npm", "start"]