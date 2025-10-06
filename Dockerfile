# Stage 1: Build the TypeScript app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the TypeScript code
RUN npm run build


# Stage 2: Run the built app
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the compiled output from the builder
COPY --from=builder /app/dist ./dist

# Expose the port your app listens on
EXPOSE 3210

# Start the app
CMD ["node", "dist/index.js"]