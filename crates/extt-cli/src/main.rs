use anyhow::{Context, Result};
use clap::Parser;
use extt_core::{Store, types::Metadata};
use extt_settings::Settings;
use std::path::PathBuf;

mod cli;
use cli::{Cli, Commands};

fn main() -> Result<()> {
    let cli = Cli::parse();
    let settings = Settings::load().context("Failed to load settings")?;
    
    // Ensure notes dir and db path exists
    // Store::new handles db dir creation.
    // We should ensure notes dir exists or create it?
    if !settings.notes_dir.exists() {
        // Create if not exists? User might want to know.
        // For MVP, auto-create.
        std::fs::create_dir_all(&settings.notes_dir).context("Failed to create notes directory")?;
    }

    let mut store = Store::new(settings.notes_dir.clone(), settings.db_path.clone())
        .context("Failed to initialize store")?;

    match &cli.command {
        Commands::List => {
            let notes = store.list()?;
            for note in notes {
                println!("{}", note.path.display());
            }
        }
        Commands::Search { query } => {
            let notes = store.search(query)?;
            for note in notes {
                println!("{}: {}", note.path.display(), note.title.as_deref().unwrap_or("No Title"));
            }
        }
        Commands::New { title, body } => {
            // Check if title ends with .md or not. 
            // extt core might expect relative path with extension?
            // Let's assume title is the filename for now, or sanitize it.
            let mut filename = title.clone();
            if !filename.ends_with(".md") {
                filename.push_str(".md");
            }
            let path = PathBuf::from(&filename);
            
            store.create(&path, body.as_deref().unwrap_or(""), Some(Metadata {
                title: Some(title.clone()),
                tags: None,
                created_at: None,
                updated_at: None,
                extra: Default::default(),
            }))?;
            println!("Created note: {}", filename);
        }
        Commands::Read { name, tail, head, from, to } => {
            let mut filename = name.clone();
            if !filename.ends_with(".md") {
                filename.push_str(".md");
            }
            let path = PathBuf::from(&filename);
            let note = store.get(&path)?;
            
            let lines: Vec<&str> = note.content.lines().collect();
            let total_lines = lines.len();
            
            // Re-eval logic for common usages:
            // --head 5: first 5 lines.
            // --tail 5: last 5 lines.
            // --from 10 --to 20: lines 10-20.
            
            let (start, end) = if let (Some(f), Some(t)) = (from, to) {
                 (f.saturating_sub(1), (*t).min(total_lines))
            } else if let Some(f) = from {
                 (f.saturating_sub(1), total_lines)
            } else if let Some(h) = head {
                 (0, (*h).min(total_lines))
            } else if let Some(t) = tail {
                 (total_lines.saturating_sub(*t), total_lines)
            } else {
                 (0, total_lines)
            };
            
            // Ensure bounds
            let start = start.clamp(0, total_lines);
            let end = end.clamp(start, total_lines);

            for i in start..end {
                println!("{}", lines[i]);
            }
        }
        Commands::Update { name, body, rename } => {
             let mut filename = name.clone();
            if !filename.ends_with(".md") {
                filename.push_str(".md");
            }
            let path = PathBuf::from(&filename);
            
            if let Some(new_name) = rename {
                 let mut new_filename = new_name.clone();
                if !new_filename.ends_with(".md") {
                    new_filename.push_str(".md");
                }
                store.move_note(&path, &PathBuf::from(&new_filename))?;
                println!("Renamed {} to {}", filename, new_filename);
            } else {
                 store.update(&path, body.as_deref(), None)?;
                 println!("Updated note: {}", filename);
            }
        }
        Commands::Delete { name } => {
             let mut filename = name.clone();
            if !filename.ends_with(".md") {
                filename.push_str(".md");
            }
            let path = PathBuf::from(&filename);
            store.delete(&path)?;
            println!("Deleted note: {}", filename);
        }
        Commands::Move { from, to } => {
             let mut from_filename = from.clone();
            if !from_filename.ends_with(".md") {
                from_filename.push_str(".md");
            }
            
             let mut to_filename = to.clone();
            if !to_filename.ends_with(".md") {
                to_filename.push_str(".md");
            }
            
            store.move_note(&PathBuf::from(&from_filename), &PathBuf::from(&to_filename))?;
            println!("Moved {} to {}", from_filename, to_filename);
        }
        Commands::Sync => {
            store.sync()?;
            println!("Database synced.");
        }
        Commands::Init => {
            let path = Settings::get_path()?;
            if path.exists() {
                println!("Configuration already exists at: {:?}", path);
            } else {
                let settings = Settings::default();
                settings.save()?;
                println!("Initialized configuration at: {:?}", path);
                println!("Notes directory set to: {:?}", settings.notes_dir);
            }
        }
        Commands::CheckConfig => {
            println!("Config loaded from default location.");
            println!("Notes Dir: {}", settings.notes_dir.display());
            println!("DB Path: {}", settings.db_path.display());
        }
        Commands::Version => {
            println!("extt-cli {}", env!("CARGO_PKG_VERSION"));
        }
    }

    Ok(())
}
