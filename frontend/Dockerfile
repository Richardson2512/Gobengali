FROM node:18-alpine

WORKDIR /app

# Install dependencies (utilizing cache)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
