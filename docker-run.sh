#!/bin/bash

# Docker Run Script for amarplot-client
# Builds and runs the Docker container locally

set -e  # Exit on any error

# Configuration
IMAGE_NAME="amarplot-client"
CONTAINER_NAME="amarplot-client-container"
PORT=3000

echo "🚀 Building and running Docker container locally..."
echo "Image: $IMAGE_NAME"
echo "Container: $CONTAINER_NAME"
echo "Port: $PORT"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop and remove existing container if it exists
echo "🧹 Cleaning up existing container..."
docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm "$CONTAINER_NAME" 2>/dev/null || true

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t "$IMAGE_NAME" .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
else
    echo "❌ Failed to build Docker image"
    exit 1
fi

# Run the container
echo "🏃 Running Docker container..."
docker run -d \
    --name "$CONTAINER_NAME" \
    -p "$PORT:3000" \
    --env-file .env.docker \
    "$IMAGE_NAME"

if [ $? -eq 0 ]; then
    echo "✅ Container started successfully!"
    echo ""
    echo "🌐 Application is running at:"
    echo "   http://localhost:$PORT"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:    docker logs $CONTAINER_NAME"
    echo "   Stop:         docker stop $CONTAINER_NAME"
    echo "   Remove:       docker rm $CONTAINER_NAME"
    echo "   Shell access: docker exec -it $CONTAINER_NAME sh"
    echo ""
    echo "🔍 Container status:"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo "❌ Failed to start container"
    exit 1
fi