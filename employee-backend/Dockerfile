# Use a lightweight Node.js image
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your backend listens on
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
