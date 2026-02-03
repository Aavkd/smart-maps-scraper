# Specify the base Docker image.
FROM apify/actor-node:20

# Copy just package.json and package-lock.json
COPY package*.json ./

# Install all dependencies.
RUN npm install --include=dev --audit=false

# Next, copy the source files.
COPY . ./

# Run the image.
CMD npm start
