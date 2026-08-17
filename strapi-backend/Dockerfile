# Stage 1: Build
FROM node:20-alpine AS build
RUN apk add --no-cache python3 make g++
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci
COPY . .
ENV STRAPI_ADMIN_BACKEND_URL=/admin-strapi
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
RUN apk add --no-cache vips-dev python3 make g++
WORKDIR /opt/app

# Copy only production dependencies and build output
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/src ./src
COPY --from=build /opt/app/database ./database
COPY --from=build /opt/app/scripts ./scripts
COPY --from=build /opt/app/tsconfig.json ./tsconfig.json

ENV NODE_ENV=production
EXPOSE 1337
CMD ["npm", "start"]
