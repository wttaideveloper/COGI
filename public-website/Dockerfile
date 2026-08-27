# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY public-website/package*.json ./
RUN npm ci
COPY public-website/ ./
COPY shared/ /shared/
ARG VITE_STRAPI_URL=http://localhost:1337
ARG VITE_PUBLIC_SITE_URL=http://localhost:5173
ARG VITE_GIVELIVELY_URL=
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY public-website/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
