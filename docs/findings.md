# Project Overview

The project **extt** is a desktop notes/text editor application built with Rust and the **GPUI** framework. It is currently in an early prototype stage.

## Structure

The project is a Cargo workspace with two members:
- **`crates/extt`**: The main application executable.
- **`crates/lib`**: A shared library crate (currently minimal).

## Key Components

### `crates/extt`

- **`main.rs`**: 
    - Entry point of the application.
    - Loads configuration using the `confy` crate.
    - Configures and opens the main window using GPUI.
    - Sets up asset loading from the `CARGO_MANIFEST_DIR`.

- **`extt.rs`**:
    - Contains the interaction logic and UI rendering for the main window (`AppWindow`).
    - The UI is currently a static mockup mainly constructed with `div` elements and hardcoded styling.
    - **Sidebar**: Displays a list of file names ("my-note-1.md", etc.) using a helper function `sidebar_item`.
    - **Content Area**: Displays hardcoded text ("Lorem ipsum...") and paths.
    - **Styling**: Extensive use of utility-like methods (`flex`, `bg`, `text_color`, `p_4`) with a custom color palette.

- **`colors.rs`**:
    - Defines a `ColorScale` struct and a `BASE` color palette (shades of gray) used throughout the app for consistent theming.

- **`config.rs`**:
    - Defines the `ExttConfig` struct, which currently holds a `vault_path`.
    - Uses `serde` for serialization.

### `crates/lib`

- **`lib.rs`**: Currently contains a placeholder `greet` function.

## Current Functionality

- The application launches a window with a custom title bar and traffic light position.
- It renders a split-pane layout (sidebar + content).
- Navigation and editing features are **not yet implemented**. The sidebar items and content are static.
- Configuration is loaded but not yet utilized for vault management.

## Next Steps

To evolve this into a functional editor, the following would likely be needed:
1.  **State Management**: Implement a model to hold the list of files and the content of the currently selected file.
2.  **File System Integration**: Connect the `vault_path` config to actual file reading/writing.
3.  **Editor Component**: Replace the static text divs with a functional text editor component (likely using GPUI's `View` or `Model` context handling for text).
4.  **Interaction**: Implement click handlers for sidebar items to switch the active document.
