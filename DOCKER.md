# Docker Setup for AmarPlot Client

This document provides comprehensive instructions for running the AmarPlot client application using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB of available RAM
- At least 1GB of available disk space

## Quick Start

### 1. Environment Setup

Copy the Docker environment template:
```bash
cp .env.docker .env
```

Edit `.env` file and fill in your actual values:
```bash
# Required: NextAuth secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_actual_secret_here

# Required: Google Maps API key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Optional: OAuth providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. Production Deployment

```bash
# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`

### 3. Development Mode

```bash
# Start development environment
docker-compose --profile dev up -d app-dev

# View development logs
docker-compose logs -f app-dev
```

The development server will be available at `http://localhost:3001` with hot reloading.

## Advanced Configuration

### Production with Nginx (Recommended)

1. Generate SSL certificates (place in `./ssl/` directory):
```bash
mkdir ssl
# Add your cert.pem and key.pem files to the ssl directory
```

2. Start with Nginx reverse proxy:
```bash
docker-compose --profile production up -d
```

This setup includes:
- SSL termination
- Rate limiting
- Static file caching
- Security headers
- Gzip compression

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|----------|
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes | - |
| `NEXTAUTH_URL` | Application URL | Yes | `http://localhost:3000` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes | - |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | Yes | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No | - |
| `FACEBOOK_CLIENT_ID` | Facebook OAuth client ID | No | - |
| `FACEBOOK_CLIENT_SECRET` | Facebook OAuth client secret | No | - |

### Health Checks

The application includes built-in health checks:
- Endpoint: `GET /api/health`
- Docker health check runs every 30 seconds
- Returns application status, uptime, and version

### Scaling

To run multiple instances:
```bash
docker-compose up -d --scale app=3
```

## Docker Commands Reference

### Building
```bash
# Build production image
docker build -t amarplot-client .

# Build development image
docker build -f Dockerfile.dev -t amarplot-client:dev .

# Build with specific target
docker build --target runner -t amarplot-client:prod .
```

### Running
```bash
# Run production container
docker run -d -p 3000:3000 --env-file .env amarplot-client

# Run development container with volume mounting
docker run -d -p 3001:3001 -v $(pwd):/app amarplot-client:dev

# Run with custom environment
docker run -d -p 3000:3000 -e NODE_ENV=production amarplot-client
```

### Debugging
```bash
# View container logs
docker logs <container_id>

# Execute shell in running container
docker exec -it <container_id> /bin/sh

# Inspect container
docker inspect <container_id>

# View resource usage
docker stats <container_id>
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   # Kill the process or use a different port
   docker-compose up -d -p 3001:3000
   ```

2. **Permission denied errors**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Out of memory errors**
   ```bash
   # Increase Docker memory limit or clean up
   docker system prune -a
   ```

4. **Build failures**
   ```bash
   # Clean build cache
   docker builder prune
   # Rebuild without cache
   docker-compose build --no-cache
   ```

### Performance Optimization

1. **Multi-stage builds**: The Dockerfile uses multi-stage builds to minimize image size
2. **Layer caching**: Dependencies are installed before copying source code
3. **Non-root user**: Containers run as non-root for security
4. **Health checks**: Built-in health monitoring
5. **Resource limits**: Configure in docker-compose.yml if needed

### Security Best Practices

1. **Secrets management**: Never commit secrets to version control
2. **Non-root execution**: Containers run as `nextjs` user
3. **Minimal base image**: Uses Alpine Linux for smaller attack surface
4. **Security headers**: Nginx configuration includes security headers
5. **Rate limiting**: API endpoints are rate-limited

## Monitoring

### Logs
```bash
# Follow all logs
docker-compose logs -f

# Follow specific service logs
docker-compose logs -f app

# View last 100 lines
docker-compose logs --tail=100 app
```

### Metrics
```bash
# Container resource usage
docker stats

# System-wide Docker usage
docker system df
```

## Production Deployment

For production deployment:

1. Use a proper SSL certificate
2. Configure environment variables securely
3. Set up log aggregation
4. Configure monitoring and alerting
5. Use a container orchestration platform (Kubernetes, Docker Swarm)
6. Implement backup strategies
7. Set up CI/CD pipelines

## Support

For issues related to Docker setup, please check:
1. Docker logs: `docker-compose logs`
2. Health check status: `curl http://localhost:3000/api/health`
3. Container status: `docker-compose ps`

For application-specific issues, refer to the main README.md file.