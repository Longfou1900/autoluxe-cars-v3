# Stage 1: Build React application
FROM node:alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the complete Vite project
COPY . .

# Build production application
RUN npm run build


# Stage 2: Production Nginx server
FROM nginx:alpine

# Configure Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite production build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]