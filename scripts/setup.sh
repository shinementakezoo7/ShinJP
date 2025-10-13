#!/bin/bash

# Setup script for Japanese Learning Platform

echo "Setting up Japanese Learning Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Copying .env.example to .env.local..."
    cp .env.example .env.local
    echo "Please update .env.local with your configuration values."
fi

echo "Setup complete!"
echo "To start the development server, run: npm run dev"