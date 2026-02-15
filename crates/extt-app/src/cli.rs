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
    #[command(visible_alias = "ls")]
    List,
    /// Search notes by name or content
    #[command(visible_alias = "s")]
    Search {
        query: String,
    },
    /// Create a new note
    #[command(visible_alias = "n")]
    New {
        title: String,
        #[arg(long, short)]
        body: Option<String>,
    },
    /// Read a note
    #[command(visible_alias = "r")]
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
    #[command(visible_alias = "u")]
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
    #[command(visible_alias = "d")]
    Delete {
        name: String,
    },
    /// Move a note
    #[command(visible_alias = "mv")]
    Move {
        from: String,
        to: String,
    },
    /// Sync database
    #[command(visible_alias = "sy")]
    Sync,
    /// Initialize the configuration
    #[command(visible_alias = "i")]
    Init,
    /// Verify config
    #[command(visible_alias = "conf")]
    CheckConfig,
}

#[cfg(test)]
mod tests {
    use super::*;
    use clap::CommandFactory;

    #[test]
    fn verify_cli() {
        Cli::command().debug_assert();
    }
}
