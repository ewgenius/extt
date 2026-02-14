#!/bin/sh

set -e

REPO="ewgenius/extt"
BINARY="extt"
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$OS" in
    linux)
        ASSET_SUFFIX="linux-amd64"
        ;;
    darwin)
        if [ "$ARCH" = "x86_64" ]; then
            ASSET_SUFFIX="darwin-amd64"
        elif [ "$ARCH" = "arm64" ]; then
            ASSET_SUFFIX="darwin-arm64"
        else
            echo "Unsupported architecture: $ARCH"
            exit 1
        fi
        ;;
    *)
        echo "Unsupported OS: $OS"
        exit 1
        ;;
esac

ASSET_NAME="${BINARY}-${ASSET_SUFFIX}"
INSTALL_DIR="$HOME/.local/bin"
mkdir -p "$INSTALL_DIR"

echo "Detected $OS $ARCH. Downloading $ASSET_NAME..."

# Fetch latest release tag
LATEST_TAG=$(curl -s "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$LATEST_TAG" ]; then
    echo "Failed to fetch latest release tag."
    exit 1
fi

DOWNLOAD_URL="https://github.com/$REPO/releases/download/$LATEST_TAG/$ASSET_NAME"

curl -L -o "$INSTALL_DIR/$BINARY" "$DOWNLOAD_URL"
chmod +x "$INSTALL_DIR/$BINARY"

echo "Successfully installed extt to $INSTALL_DIR/$BINARY"

if ! echo "$PATH" | grep -q "$INSTALL_DIR"; then
    echo "Warning: $INSTALL_DIR is not in your PATH."
    echo "Add the following to your shell configuration (e.g., ~/.bashrc, ~/.zshrc):"
    echo "export PATH=\"$INSTALL_DIR:\$PATH\""
fi
