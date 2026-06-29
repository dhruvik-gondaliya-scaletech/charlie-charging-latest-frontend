#!/bin/bash

set -e  # Exit on error

APP_NAME="scale-ev-frontend"
CONTAINER_NAME="scale-ev-frontend-container"
PORT=6163

echo "🚀 Starting deployment..."

# Step 1: Stop & remove old container (if exists)
echo "🛑 Stopping old container..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Step 2: Pull latest code
echo "📥 Pulling latest code..."
git pull origin feat/export-ocpp-logs

# Step 3: Load env + Build new Docker image
echo "🏗️ Building Docker image with env..."

# Load .env file
if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
  --build-arg NEXT_PUBLIC_API_TIMEOUT=$NEXT_PUBLIC_API_TIMEOUT \
  --build-arg NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL \
  --build-arg NEXT_PUBLIC_AUTH_TOKEN_KEY=$NEXT_PUBLIC_AUTH_TOKEN_KEY \
  --build-arg NEXT_PUBLIC_AUTH_USER_KEY=$NEXT_PUBLIC_AUTH_USER_KEY \
  --build-arg NEXT_PUBLIC_AUTH_TENANT_KEY=$NEXT_PUBLIC_AUTH_TENANT_KEY \
  --build-arg NEXT_PUBLIC_CSMS_WEBSOCKET_BASE_URL=$NEXT_PUBLIC_CSMS_WEBSOCKET_BASE_URL \
  --build-arg NEXT_PUBLIC_FRONTEND_PRIVATE_KEY="$NEXT_PUBLIC_FRONTEND_PRIVATE_KEY" \
  --build-arg NEXT_PUBLIC_STORAGE_SECRET=$NEXT_PUBLIC_STORAGE_SECRET \
  --build-arg NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
  --build-arg NEXT_PUBLIC_CALENDLY_URL=$NEXT_PUBLIC_CALENDLY_URL \
  --build-arg NEXT_PUBLIC_SLACK_WEBHOOK_URL=$NEXT_PUBLIC_SLACK_WEBHOOK_URL \
  -t $APP_NAME .

# Step 4: Run new container
echo "▶️ Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:6163 \
  --env-file .env \
  --restart unless-stopped \
  $APP_NAME

echo "✅ Deployment completed successfully!"