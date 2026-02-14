# extt

A powerful, Rust-based notes application designed for the terminal and AI agents. `extt` provides a fast, efficient way to manage your markdown notes with a robust CLI interface.

## Features

-   **File-System Based**: Notes are stored as standard Markdown files in your configured directory (default: `~/Notes`).
-   **SQLite Indexing**: Fast search and retrieval powered by a local SQLite database index.
-   **CLI Interface**: Comprehensive command-line tools for creating, reading, updating, deleting, and moving notes.
-   **Metadata Support**: Handles YAML frontmatter for note metadata.
-   **Agent Ready**: Designed to be easily used by AI agents and automated workflows.

## Installation

### Automatic (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/ewgenius/extt/main/install.sh | sh
```

### Manual

Download the latest binary for your platform from the [Releases](https://github.com/ewgenius/extt/releases) page.

### From Source

Ensure you have Rust and Cargo installed.

```bash
cargo install --path crates/extt
```

## Configuration

Configuration is stored in `~/.config/extt/config.toml` (or your OS equivalent).

Default settings:
-   **Notes Directory**: `~/Notes`
-   **Database Path**: `~/.config/extt/index.db` (macOS: `~/Library/Application Support/extt/index.db`)

## Usage

### Initialize Configuration
```bash
extt init
```

### Create a Note
```bash
extt new "My Note" --body "Content of the note"
```

### List Notes
```bash
extt list
```

### Read a Note
```bash
extt read "My Note"
# Read first 5 lines
extt read "My Note" --head 5
# Read last 5 lines
extt read "My Note" --tail 5
# Read specific range
extt read "My Note" --from 10 --to 20
```

### Search Notes
```bash
extt search "query"
```

### Update a Note
```bash
extt update "My Note" --body "New content"
```

### Rename/Move a Note
```bash
extt move "My Note" "New Name"
```

### Delete a Note
```bash
extt delete "My Note"
```

### Sync Index
Manually rebuild the database index from files.
```bash
extt sync
```
