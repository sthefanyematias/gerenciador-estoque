
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx ng build --configuration production --base-href /

FROM nginx:alpine
RUN apk add --no-cache nodejs npm
RUN npm install -g json-server

COPY --from=build /app/dist /app/dist
RUN BROWSER_DIR=$(find /app/dist -name "browser" -type d | head -n 1) && \
    cp -r $BROWSER_DIR /usr/share/nginx/html_app

COPY db.json /app/db.json
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"]
