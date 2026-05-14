FROM node:18-alpine

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID

# Install dependencies (utilizing cache)
COPY package.json package-lock.json* .npmrc* ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Cache bust for env changes
ARG CACHEBUST=1

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
