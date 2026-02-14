use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "extt")]
#[command(about = "A notes system for the terminal", long_about = None)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    /// List notes in configured folder
    List,
    /// Search notes by name or content
    Search {
        query: String,
    },
    /// Create a new note
    New {
        title: String,
        #[arg(long, short)]
        body: Option<String>,
    },
    /// Read a note
    Read {
        name: String,
        /// Show last N lines
        #[arg(long)]
        tail: Option<usize>,
        /// Show first N lines
        #[arg(long)]
        head: Option<usize>,
        /// Start from line N
        #[arg(long)]
        from: Option<usize>,
        /// End at line N
        #[arg(long)]
        to: Option<usize>,
    },
    /// Update a note
    Update {
        name: String,
        #[arg(long)]
        body: Option<String>,
        #[arg(long)]
        rename: Option<String>,
        // Partial update not fully implemented in CLI yet, but requested.
        // For now sticking to full body update as primary.
    },
    /// Delete a note
    Delete {
        name: String,
    },
    /// Move a note
    Move {
        from: String,
        to: String,
    },
    /// Sync database
    Sync,
    /// Initialize the configuration
    Init,
    /// Verify config
    CheckConfig,
    /// Helper to see version
    Version,
}
