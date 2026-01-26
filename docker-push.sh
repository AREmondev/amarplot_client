#!/bin/bash

# Docker Push Script for amarplot-client
# Repository: emon98/amarplot-client

set -e  # Exit on any error

# Configuration
REPOSITORY="emon98/amarplot-client"
TAG=${1:-latest}  # Use first argument as tag, default to 'latest'
DOCKERFILE=${2:-Dockerfile}  # Use second argument as dockerfile, default to 'Dockerfile'

echo "🚀 Building and pushing Docker image..."
echo "Repository: $REPOSITORY"
echo "Tag: $TAG"
echo "Dockerfile: $DOCKERFILE"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Enable Docker buildx for multi-platform builds
echo "🔧 Setting up Docker buildx..."
docker buildx create --name multiarch --use 2>/dev/null || docker buildx use multiarch 2>/dev/null || docker buildx use default

# Build the Docker image for multiple platforms
echo "📦 Building Docker image for multiple platforms (linux/amd64,linux/arm64)..."
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    -f "$DOCKERFILE" \
    -t "$REPOSITORY:$TAG" \
    --push \
    .

if [ $? -eq 0 ]; then
    echo "✅ Multi-platform Docker image built and pushed successfully!"
else
    echo "❌ Failed to build and push Docker image"
    exit 1
fi

# Build and push latest tag if different from main tag
if [ "$TAG" != "latest" ]; then
    echo "📤 Building and pushing latest tag for multiple platforms..."
    docker buildx build \
        --platform linux/amd64,linux/arm64 \
        -f "$DOCKERFILE" \
        -t "$REPOSITORY:latest" \
        --push \
        .
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed $REPOSITORY:latest"
    else
        echo "❌ Failed to push latest tag"
        exit 1
    fi
fi

echo ""
echo "🎉 All done! Your image is now available at:"
echo "   docker pull $REPOSITORY:$TAG"
if [ "$TAG" != "latest" ]; then
    echo "   docker pull $REPOSITORY:latest"
fi
echo ""
echo "💡 Usage examples:"
echo "   ./docker-push.sh                    # Push with 'latest' tag"
echo "   ./docker-push.sh v1.0.0             # Push with 'v1.0.0' tag"
echo "   ./docker-push.sh v1.0.0 Dockerfile.dev  # Push dev build with 'v1.0.0' tag"