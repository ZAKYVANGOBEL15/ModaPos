# Tahap 1: Build aplikasi React/Vite
FROM node:20-alpine AS builder

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code
COPY . .

# Build project ke folder /dist
RUN npm run build

# Tahap 2: Menyiapkan server Nginx untuk Production
FROM nginx:alpine

# Copy konfigurasi custom Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari tahap 1 ke folder Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Ekspos port 8080 (standar Google Cloud Run)
EXPOSE 8080

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
