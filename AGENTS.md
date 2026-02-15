# AGENTS.md

## Using extt with AI Agents

`extt` is a fast, simple, and agent-ready terminal notes application. It provides a structured and deterministic interface for interacting with the notes system, making it an ideal tool for AI agents.

## Core Principles for Agents

1.  **Stateless Operations**: Each CLI command is independent. Ensure you have the necessary context (e.g., exact filenames) before executing an action.
2.  **Verification First**: Before reading or updating a note, consider verifying its existence using `extt list` or `extt search`.
3.  **Atomic Updates**: `extt update` replaces the _entire body_ of a note. Always read the full content before modifying and writing back.

## Project Structure for Agents

Understanding the repository structure can help you navigate the codebase:

- `crates/extt-cli`: The source code for the `extt` CLI tool.
- `crates/extt-core`: The core logic, including storage and file handling.
- `crates/extt-app`: The upcoming desktop application.
- `apps/web`: The Next.js web application.

## Workflow Examples

### 1. Research and Summarize

**Goal**: Find notes about "Project X" and summarize them into a new note.

1.  **Search**: `extt search "Project X"`
    - _Output_: List of matching filenames.
2.  **Read**: For each matching file, `extt read "Filename"`
    - _Output_: Content of the note.
3.  **Synthesize**: Agent processes the content and generates a summary.
4.  **Create**: `extt new "Project X Summary" --body "Summary content..."`

### 2. Fact Conservation

**Goal**: Update a note with new information without losing existing data.

1.  **Read**: `extt read "Target Note"`
2.  **Process**: Append new information to the retrieved content in memory.
3.  **Update**: `extt update "Target Note" --body "Old content + New content"`

### 3. Cleaning and Organization

**Goal**: Move all "Draft" notes to a "Drafts" folder (simulated by renaming).

1.  **List**: `extt list`
2.  **Filter**: Identify notes starting with "Draft - ".
3.  **Move**: Loop through identified notes and rename/move them.
    - `extt move "Draft - Note A" "Drafts/Note A"`

## CLI Reference for Agents

- `init`: Initializes the configuration file if missing.
- `new <TITLE> --body <CONTENT>`: Creates a new note. Fails if note exists.
- `read <TITLE>`: Outputs raw content to stdout.
- `update <TITLE> --body <CONTENT>`: Overwrites content.
- `delete <TITLE>`: Permanently removes the note.
- `list`: Returns a newline-separated list of all note paths.
- `search <QUERY>`: Returns a newline-separated list of matching notes (path: title).
- `move <FROM> <TO>`: Renames or moves a note.
- `sync`: Synchronizes the internal database with the filesystem.
- `version`: Prints the current version.
- `upgrade`: Upgrades the binary to the latest version.

## Error Handling

- **Exit Code 0**: Success.
- **Exit Code Non-Zero**: Failure. Check stderr for details (e.g., "File not found", "Database error").
