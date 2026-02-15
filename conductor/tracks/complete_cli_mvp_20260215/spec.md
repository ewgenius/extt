# Specification: Complete Core CLI Functionality for the MVP

## 1. Overview
This track focuses on solidifying the core features of the `extt-cli` to ensure it is a robust and complete tool for both human and agent use, fulfilling the requirements for a Minimum Viable Product (MVP). This involves reviewing the existing commands, implementing any missing functionality, enhancing existing commands, and ensuring comprehensive test coverage.

## 2. Functional Requirements
The `extt-cli` must provide the following functionalities as per the `README.md`:

### 2.1. Note Management
- **`extt init`**: Initialize the notes directory and configuration.
- **`extt new "My Note" --body "Content"`**: Create a new note with an optional body.
- **`extt list`**: List all available notes.
- **`extt read "My Note"`**: Read the content of a specific note. This should also support `--head`, `--from`, and `--to` flags.
- **`extt search "query"`**: Search for notes containing a specific query.
- **`extt update "My Note" --body "New content"`**: Update the content of an existing note.
- **`extt move "My Note" "New Name"`**: Rename a note.
- **`extt delete "My Note"`**: Delete a note.

### 2.2. Indexing and Maintenance
- **`extt sync`**: Synchronize the note index.
- **`extt version`**: Display the current version of the CLI.
- **`extt upgrade`**: Upgrade the CLI to the latest version.

## 3. Non-Functional Requirements
- **Performance:** All CLI commands should be fast and responsive.
- **Reliability:** The CLI should handle errors gracefully and provide clear feedback to the user.
- **Test Coverage:** Core logic in `extt-core` and command logic in `extt-cli` should have a test coverage of at least 80%.
- **Usability:** Commands should be intuitive and follow common CLI conventions.

## 4. Out of Scope for this Track
- New commands not listed in the `README.md`.
- Desktop application development.
- Web application development.
- Mobile application development.
- Advanced agent integration beyond direct CLI usage.
