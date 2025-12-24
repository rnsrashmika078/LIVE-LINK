# Use official Node.js image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of your app's source code
COPY . .



# Expose Next.js default port
EXPOSE 3000

# Start the app
CMD npm run dev

#docker build -t my-next-app .
#Run the container
#docker run -p 3000:3000 -v $(pwd):/app my-next-app
