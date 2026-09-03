# Stage 1: Build the site using Node.js
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
# Compile Tailwind CSS
RUN npm run build:css
# Build HTML with Vite
RUN npm run build

# Stage 2: Serve the site using Nginx Alpine
FROM nginx:alpine
# Copy the compiled output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
