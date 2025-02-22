# Use a Node image based on Debian (Linux)
FROM node:18-bullseye-slim

# Install TeX Live packages required for LaTeX compilation
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3030

# Start your application (adjust if using a different command)
CMD ["npm", "run", "dev"]
