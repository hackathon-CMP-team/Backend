# Use the official lightweight Node.js 18 image
FROM node:18.12.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port on which the application listens
EXPOSE 3000

# This is test for the Jenkins pipeline for CI/CD. I will remove it again.

# Start the application
CMD ["npm", "run", "start:dev"]
