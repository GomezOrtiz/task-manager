FROM node:12.18.1-alpine

WORKDIR /code

COPY . .
RUN npm install && npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]