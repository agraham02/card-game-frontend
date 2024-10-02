# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
# RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Start the frontend
CMD ["npm", "run", "dev"]
