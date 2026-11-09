#!/bin/bash
set -e

echo "=========================================="
echo "   DEPLOYMENT OTOMATIS PENPROMEDIA"
echo "=========================================="

echo "[1/3] Menarik kode terbaru dari GitHub..."
git pull origin main

echo "[2/3] Membangun ulang Docker image (penpromedia-app)..."
docker build --no-cache -t penpromedia-app .

echo "[3/3] Merestart container (penpromedia-container pada port 8080)..."
docker stop penpromedia-container 2>/dev/null || true
docker rm penpromedia-container 2>/dev/null || true
docker run -d -p 8080:80 --name penpromedia-container penpromedia-app

echo "=========================================="
echo "   DEPLOYMENT SELESAI & BERHASIL!"
echo "=========================================="
docker ps --filter "name=penpromedia-container"

