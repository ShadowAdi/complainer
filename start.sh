#!/bin/bash
set -e

echo "Starting Complainer API..."
echo "Current working directory: $(pwd)"
echo "Listing project root:"
ls -la

echo "Checking if dist directory exists:"
if [ -d "dist" ]; then
    echo "✓ dist directory found"
    ls -la dist/
else
    echo "✗ dist directory not found, running build..."
    npm run build
fi

echo "Checking if index.js exists in dist:"
if [ -f "dist/index.js" ]; then
    echo "✓ dist/index.js found"
else
    echo "✗ dist/index.js not found!"
    exit 1
fi

echo "Starting application with: node ./dist/index.js"
exec node ./dist/index.js