FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including ts-node and typescript devDependencies)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
