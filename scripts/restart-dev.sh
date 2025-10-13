#!/bin/bash

# Restart Next.js development server with proper Gitpod configuration

echo "Stopping any existing Next.js development server..."
pkill -f "next dev" || true

echo "Waiting for ports to be released..."
sleep 3

echo "Starting Next.js development server on port 3000..."
npm run dev