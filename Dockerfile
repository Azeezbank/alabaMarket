
# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build (only if needed for frontend or TS compilation)
# RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "dev"]