FROM node:18

WORKDIR /usr/src/app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the port the app will listen on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
