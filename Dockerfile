# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the container
COPY . .

# Build your React app
RUN npm run build

# Set environment variables (build args)
ARG MONGODB
ARG PORT

# Pass environment variables to the app
ENV MONGODB=${MONGODB}
ENV PORT=${PORT}

# Expose the port your app will run on
EXPOSE ${PORT}

# Start the app
CMD [ "npm", "start" ]