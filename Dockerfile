# Base image with Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Compile TypeScript
RUN rm -rf dist && npx tsc

# Generate Prisma client
RUN npx prisma generate

# Expose the port Express runs on
EXPOSE 3000

# Run db push then start the app
CMD sh -c "npx prisma db push && npm start"