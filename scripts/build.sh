#!/bin/sh
set -eu

PROJECT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
OUTPUT_DIR="$PROJECT_DIR/dist"

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/assets"

cp "$PROJECT_DIR/euclid-loss-determination.html" "$OUTPUT_DIR/index.html"
cp "$PROJECT_DIR/assets/euclid-logo.png" "$OUTPUT_DIR/assets/euclid-logo.png"
cp "$PROJECT_DIR/_headers" "$OUTPUT_DIR/_headers"
cp "$PROJECT_DIR/robots.txt" "$OUTPUT_DIR/robots.txt"

printf 'Built Cloudflare Pages output in %s\n' "$OUTPUT_DIR"
