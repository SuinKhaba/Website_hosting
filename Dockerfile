# Start with an official Node.js image that has Python installed
FROM node:20-bullseye

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    ln -sf python3 /usr/bin/python

# Set working directory
WORKDIR /app

# Copy package.json and install Node dependencies
COPY Backend/package*.json ./Backend/
RUN cd Backend && npm install

# Copy Python requirements and install them
COPY Backend/requirements.txt ./Backend/
RUN pip3 install --no-cache-dir -r Backend/requirements.txt

# Copy all source files
COPY . .

# Set environment variables (optional, or use Render Environment settings)
ENV PORT=5000

# Expose backend port
EXPOSE 5000

# Start the Node server
CMD ["node", "Backend/server.js"]
