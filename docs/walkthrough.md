# Walkthrough - Zed Codebase Exploration

## App Lifecycle

- **Entry Point**: `crates/zed/src/main.rs`.
- **Initialization**: `main` function initializes logging, settings, and the app. It calls `app.run`.
- **Workspace Creation**: `restore_or_create_workspace` determines if a previous workspace should be restored or a new one created. `Workspace::new` initializes the workspace structure.

## Workspace Structure

- **Crate**: `crates/workspace`.
- **Key Components**:
  - `Workspace`: The main struct holding state for a window.
  - `Pane`: Holds a collection of items (editors, etc.).
  - `Dock`: Holds panels (project, terminal, etc.).
  - `Project`: Manages the underlying data (files, worktrees).

## Editor Implementation

- **Crate**: `crates/editor`.
- **Key Structs**:
  - `Editor`: The central struct for editor state. It holds a `MultiBuffer` and `DisplayMap`.
  - `EditorElement`: Responsible for rendering the editor. It handles layout and painting of text, cursors, and gutters. It implements `Element` (or similar custom rendering) by calculating layouts and painting directly to the window.
  - `MultiBuffer`: Located in `crates/multi_buffer`. It manages the text content, potentially across multiple files (excerpts) and handles diffs.
  - `DisplayMap`: Handles visual mapping (folds, wraps) of the text.

## File System & Project Management

- **Crate**: `crates/project` (Project logic), `crates/fs` (File system abstraction).
- **Key Components**:
  - `Project`: Manages `Worktree`s which correspond to open folders.
  - `Fs` trait: Abstract file system interface. `RealFs` is the concrete implementation.

## File Tree View (Project Panel)

- **Crate**: `crates/project_panel`.
- **Implementation**:
  - `ProjectPanel` struct implements `Render`.
  - It uses a `uniform_list` (virtualized list) to render `visible_entries`.
  - `visible_entries` is a flattened list of open directories and files, updated when directories are expanded/collapsed.
  - Drag and drop, context menus, and indent guides are handled within the `render` method and event listeners.
