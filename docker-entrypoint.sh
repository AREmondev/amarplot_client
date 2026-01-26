#!/bin/sh

# Docker entrypoint script for Next.js application

set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting Next.js application..."

# Check if required environment variables are set
if [ -z "$NEXTAUTH_SECRET" ]; then
    log "WARNING: NEXTAUTH_SECRET is not set. Generating a random secret..."
    export NEXTAUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
fi

# Set default values for environment variables if not provided
export NEXTAUTH_URL=${NEXTAUTH_URL:-"http://localhost:3000"}
export NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL:-"http://localhost:3000"}
export PORT=${PORT:-3000}
export HOSTNAME=${HOSTNAME:-"0.0.0.0"}

log "Environment configured:"
log "  PORT: $PORT"
log "  HOSTNAME: $HOSTNAME"
log "  NEXTAUTH_URL: $NEXTAUTH_URL"
log "  NODE_ENV: $NODE_ENV"

# Wait for dependencies if needed
if [ "$WAIT_FOR_DB" = "true" ]; then
    log "Waiting for database connection..."
    # Add database connection check here if needed
fi

# Start the Next.js application
log "Starting Next.js server on $HOSTNAME:$PORT"
exec node server.js