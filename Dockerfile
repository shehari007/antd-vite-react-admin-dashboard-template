# Two stages: the first has Node and the whole dependency tree, the second has
# nothing but nginx and the built files. The image that ships is about 50 MB
# rather than about 500 MB, and none of your source code is in it.

# ---- Stage 1: build -------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Copy the manifests first. Docker caches this layer, so `npm ci` only re-runs
# when a dependency actually changed, not on every source edit.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: serve -------------------------------------------------------
FROM nginx:alpine AS serve

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
