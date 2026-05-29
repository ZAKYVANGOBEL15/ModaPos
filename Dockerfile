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

# Tangkap ARG dari Google Cloud Build saat build-time
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_GEMINI_API_KEY

# Set sebagai ENV agar terbaca oleh Vite (npm run build)
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

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
