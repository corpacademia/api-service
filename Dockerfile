FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install ALL dependencies (including socket.io)
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
