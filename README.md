# extt

A terminal notes application for managing markdown files. Fast, simple, and agent-ready.

## Installation

### Automatic (Recommended)

```bash
curl -fsSL https://extt.app/install | sh
```

### Manual

Download the latest binary for your platform from the [Releases](https://github.com/ewgenius/extt/releases) page.

### From Source

Ensure you have Rust and Cargo installed.

```bash
cargo install --path crates/extt
```

## Configuration

Config: `~/.config/extt/config.toml`. Default notes directory: `~/Notes`.

## Usage

```bash
# Initialize
extt init

# Create
extt new "My Note" --body "Content"

# List
extt list

# Read
extt read "My Note"
extt read "My Note" --head 5
extt read "My Note" --from 10 --to 20

# Search
extt search "query"

# Update
extt update "My Note" --body "New content"

# Move
extt move "My Note" "New Name"

# Delete
extt delete "My Note"

# Sync index
extt sync
```
