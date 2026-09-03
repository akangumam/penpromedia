# Stage 1: Build the site using Node.js
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
# Build HTML static files with Astro
RUN npm run build

# Stage 2: Serve the site using Nginx Alpine
FROM nginx:alpine
# Copy the compiled output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# VERY IMPORTANT: Copy the assets folder so images don't 404 in production!
COPY --from=builder /app/assets /usr/share/nginx/html/assets

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
