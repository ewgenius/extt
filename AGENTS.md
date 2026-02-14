# AGENTS.md

## Using extt with AI Agents

`extt` is designed with automation in mind. The CLI provides a structured and deterministic interface for interacting with the notes system, making it an ideal tool for AI agents.

## Core Principles for Agents

1.  **Stateless Operations**: Each CLI command is independent. Ensure you have the necessary context (e.g., exact filenames) before executing an action.
2.  **Verification First**: Before reading or updating a note, consider verifying its existence using `extt list` or `extt search`.
3.  **Atomic Updates**: `extt update` replaces the *entire body* of a note (unless specific flags like partial updates are added in future versions). Always read the full content before modifying and writing back.

## Workflow Examples

### 1. Research and Summarize

**Goal**: Find notes about "Project X" and summarize them into a new note.

1.  **Search**: `extt search "Project X"`
    -   *Output*: List of matching filenames.
2.  **Read**: For each matching file, `extt read "Filename"`
    -   *Output*: Content of the note.
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
    -   `extt move "Draft - Note A" "Drafts/Note A"`

## CLI Reference for Agents

-   `init`: Initializes the configuration file if missing.
-   `new <TITLE> --body <CONTENT>`: Creates a new note. Fails if note exists.
-   `read <TITLE>`: Outputs raw content to stdout.
-   `update <TITLE> --body <CONTENT>`: Overwrites content.
-   `delete <TITLE>`: Permanently removes the note.
-   `list`: Returns a newline-separated list of all note paths.
-   `search <QUERY>`: Returns a newline-separated list of matching notes (path: title).

## Error Handling

-   **Exit Code 0**: Success.
-   **Exit Code Non-Zero**: Failure. Check stderr for details (e.g., "File not found", "Database error").
