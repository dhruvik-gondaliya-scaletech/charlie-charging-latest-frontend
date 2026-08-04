#!/bin/bash

set -e  # Exit on error

APP_NAME="scale-ev-frontend"
CONTAINER_NAME="scale-ev-frontend-container"
PORT=6163
TEMP_NAME="${CONTAINER_NAME}-candidate"
TEMP_PORT=$((PORT + 10000))
HEALTH_RETRIES=20
HEALTH_DELAY=3

echo "🚀 Starting zero-downtime deployment..."

# Step 1: Pull latest code
echo "📥 Pulling latest code..."
git pull

# Step 2: Load env + Build candidate Docker image (old container stays live)
echo "🏗️ Building candidate Docker image (live container still running, no downtime yet)..."

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
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY" \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID" \
  -t "${APP_NAME}:candidate" .

# Step 3: Run candidate container on temporary port
echo "🧪 Starting candidate container on temporary port ${TEMP_PORT} for health check..."
docker rm -f "$TEMP_NAME" 2>/dev/null || true
docker run -d \
  --name "$TEMP_NAME" \
  -p "${TEMP_PORT}:6163" \
  --env-file .env \
  "${APP_NAME}:candidate"

# Step 4: Health check polling loop
echo "🏥 Waiting for candidate container health check..."
HEALTHY=false
for i in $(seq 1 $HEALTH_RETRIES); do
    if curl -fs "http://127.0.0.1:${TEMP_PORT}/" > /dev/null; then
        HEALTHY=true
        echo "✅ Candidate container healthy after ${i} check(s)."
        break
    fi
    echo "⏳ Not ready yet (attempt $i/$HEALTH_RETRIES)..."
    sleep $HEALTH_DELAY
done

if [ "$HEALTHY" != "true" ]; then
    echo "❌ Candidate image failed health check. Aborting deployment. Live container remains untouched."
    docker logs --tail 50 "$TEMP_NAME" 2>/dev/null || true
    docker rm -f "$TEMP_NAME" 2>/dev/null || true
    exit 1
fi

# Step 5: Clean candidate container & swap live container
echo "🔄 Candidate is healthy. Swapping live container..."
docker rm -f "$TEMP_NAME" 2>/dev/null || true
docker tag "${APP_NAME}:candidate" "$APP_NAME"

echo "🛑 Removing old container..."
docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

echo "▶️ Starting new container..."
docker run -d \
  --name "$CONTAINER_NAME" \
  -p "${PORT}:6163" \
  --env-file .env \
  --restart unless-stopped \
  "$APP_NAME"

echo "✅ Zero-downtime deployment completed successfully!"