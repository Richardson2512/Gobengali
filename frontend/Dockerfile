FROM node:18-alpine

WORKDIR /app

# Install dependencies (utilizing cache)
COPY package.json package-lock.json* .npmrc* ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
