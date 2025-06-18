FROM node:24-bookworm AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build


FROM nginx:stable-bookworm

COPY --from=build /app/nginx/conf.d /etc/nginx/conf.d
COPY --from=build /app/dist /var/www

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]