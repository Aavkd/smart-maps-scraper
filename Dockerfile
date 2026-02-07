# Dockerfile
FROM apify/actor-node-playwright-chrome:20

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Run the image
CMD [ "npm", "start" ]