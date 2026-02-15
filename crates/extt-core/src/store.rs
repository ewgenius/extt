use crate::types::{Metadata, Note, NoteSummary};
use anyhow::{anyhow, Context, Result};
use gray_matter::engine::YAML;
use gray_matter::Matter;
use rusqlite::{params, Connection};
use std::fs;
use std::path::{Component, Path, PathBuf};
use walkdir::WalkDir;

/// A persistent store for notes, backed by a SQLite database and the filesystem.
pub struct Store {
    conn: Connection,
    root_dir: PathBuf,
}

impl Store {
    /// Creates a new `Store` instance.
    ///
    /// # Arguments
    ///
    /// * `root_dir` - The root directory where notes are stored.
    /// * `db_path` - The path to the SQLite database file.
    pub fn new(root_dir: PathBuf, db_path: PathBuf) -> Result<Self> {
        if let Some(parent) = db_path.parent() {
            fs::create_dir_all(parent).context("Failed to create database directory")?;
        }
        let conn = Connection::open(&db_path).context("Failed to open database connection")?;
        
        conn.execute(
            "CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY,
                path TEXT NOT NULL UNIQUE,
                title TEXT,
                created_at TEXT,
                updated_at TEXT
            )",
            [],
        ).context("Failed to create notes table")?;

        Ok(Self { conn, root_dir })
    }

    /// Synchronizes the database with the filesystem.
    ///
    /// Scans the root directory for markdown files and updates the database
    /// to reflect the current state of files, including titles extracted from frontmatter.
    pub fn sync(&mut self) -> Result<()> {
        let tx = self.conn.transaction().context("Failed to start transaction")?;

        // Clear existing entries.
        // TODO: A more efficient sync would perform a diff.
        tx.execute("DELETE FROM notes", []).context("Failed to clear notes table")?;

        for entry in WalkDir::new(&self.root_dir).into_iter().filter_map(|e| e.ok()) {
            if entry.file_type().is_file() && entry.path().extension().map_or(false, |e| e == "md") {
                let path = entry.path();
                let relative_path = path.strip_prefix(&self.root_dir)
                    .context("Failed to strip prefix")?
                    .to_string_lossy()
                    .to_string();
                
                let content = fs::read_to_string(path).unwrap_or_default();
                let matter = Matter::<YAML>::new();
                let parsed = matter.parse(&content);
                
                let metadata: Option<Metadata> = parsed.data.map(|d| d.deserialize()).transpose().unwrap_or(None);
                
                let title = metadata.as_ref()
                    .and_then(|m| m.title.clone())
                    .or_else(|| path.file_stem().map(|s| s.to_string_lossy().to_string()));

                tx.execute(
                    "INSERT INTO notes (path, title) VALUES (?1, ?2)",
                    params![relative_path, title],
                ).context("Failed to insert note into database")?;
            }
        }
        tx.commit().context("Failed to commit transaction")?;
        Ok(())
    }

    /// Lists all notes in the store.
    pub fn list(&self) -> Result<Vec<NoteSummary>> {
        let mut stmt = self.conn.prepare("SELECT path, title FROM notes ORDER BY path")?;
        let note_iter = stmt.query_map([], |row| {
            Ok(NoteSummary {
                path: PathBuf::from(row.get::<_, String>(0)?),
                title: row.get(1)?,
            })
        })?;

        let mut notes = Vec::new();
        for note in note_iter {
            notes.push(note?);
        }
        Ok(notes)
    }

    /// Searches for notes matching the given query.
    ///
    /// Currently searches both file paths and titles.
    pub fn search(&self, query: &str) -> Result<Vec<NoteSummary>> {
        let mut stmt = self.conn.prepare("SELECT path, title FROM notes WHERE title LIKE ?1 OR path LIKE ?1")?;
        let pattern = format!("%{}%", query);
        let note_iter = stmt.query_map(params![pattern], |row| {
             Ok(NoteSummary {
                path: PathBuf::from(row.get::<_, String>(0)?),
                title: row.get(1)?,
            })
        })?;

        let mut notes = Vec::new();
        for note in note_iter {
            notes.push(note?);
        }
        Ok(notes)
    }

    /// Retrieves a note by its relative path.
    pub fn get(&self, relative_path: &Path) -> Result<Note> {
        let path = self.secure_join(relative_path)?;
        let content = fs::read_to_string(&path).context("Failed to read note file")?;
        let matter = Matter::<YAML>::new();
        let parsed = matter.parse(&content);

        let metadata: Metadata = parsed.data.map(|d| d.deserialize()).transpose()?.unwrap_or(Metadata {
             title: None, tags: None, created_at: None, updated_at: None, extra: Default::default()
        });

        Ok(Note {
            path: relative_path.to_path_buf(),
            metadata,
            content: parsed.content,
        })
    }

    /// Creates a new note with the given content and metadata.
    ///
    /// If the file already exists, it will be overwritten.
    pub fn create(&mut self, relative_path: &Path, content: &str, metadata: Option<Metadata>) -> Result<()> {
        let path = self.secure_join(relative_path)?;
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).context("Failed to create parent directories")?;
        }

        let mut file_content = String::new();
        if let Some(meta) = &metadata {
            let yaml = serde_yaml::to_string(meta).context("Failed to serialize metadata")?;
            file_content.push_str("---\n");
            file_content.push_str(&yaml);
            file_content.push_str("---\n");
        }
        file_content.push_str(content);

        fs::write(&path, file_content).context("Failed to write note file")?;
        
        let title = metadata.as_ref()
            .and_then(|m| m.title.clone())
            .or_else(|| path.file_stem().map(|s| s.to_string_lossy().to_string()));

        self.conn.execute(
            "INSERT OR REPLACE INTO notes (path, title) VALUES (?1, ?2)",
             params![relative_path.to_string_lossy(), title],
        ).context("Failed to update database")?;

        Ok(())
    }

    /// Updates an existing note.
    ///
    /// * `relative_path` - Path to the note.
    /// * `content` - If provided, replaces the note's content. Metadata is preserved unless `title` is also provided and contradicts.
    /// * `title` - If provided, updates the title in the metadata.
    ///
    /// Note: This implementation currently reads the file, updates the in-memory representation, and rewrites the file.
    pub fn update(&mut self, relative_path: &Path, content: Option<&str>, title: Option<&str>) -> Result<()> {
         let mut note = self.get(relative_path)?;
         
         if let Some(c) = content {
             note.content = c.to_string();
         }
         
         if let Some(t) = title {
             note.metadata.title = Some(t.to_string());
         }

         // Serialize back to file
         let path = self.secure_join(relative_path)?;

         let mut file_content = String::new();
         // Always write frontmatter if metadata exists or we have a title.
         // We check if metadata is effectively empty, but since we might have just added a title, we check that too.
         // Actually, `serde_yaml::to_string` handles it.

         let yaml = serde_yaml::to_string(&note.metadata).context("Failed to serialize metadata")?;
         file_content.push_str("---\n");
         file_content.push_str(&yaml);
         file_content.push_str("---\n");

         file_content.push_str(&note.content);

         fs::write(&path, file_content).context("Failed to write updated note file")?;

         // Update DB
         if let Some(t) = &note.metadata.title {
              self.conn.execute(
                "UPDATE notes SET title = ?1 WHERE path = ?2",
                params![t, relative_path.to_string_lossy()]
            ).context("Failed to update database")?;
         }
         
         Ok(())
    }

    /// Deletes a note.
    pub fn delete(&mut self, relative_path: &Path) -> Result<()> {
        let path = self.secure_join(relative_path)?;
        if path.exists() {
            fs::remove_file(path).context("Failed to remove file")?;
        }
        self.conn.execute("DELETE FROM notes WHERE path = ?1", params![relative_path.to_string_lossy()])
            .context("Failed to remove from database")?;
        Ok(())
    }
    
    /// Moves a note from one path to another.
    pub fn move_note(&mut self, from: &Path, to: &Path) -> Result<()> {
        let from_path = self.secure_join(from)?;
        let to_path = self.secure_join(to)?;
        
        if let Some(parent) = to_path.parent() {
            fs::create_dir_all(parent).context("Failed to create parent directory")?;
        }
        
        fs::rename(&from_path, &to_path).context("Failed to rename file")?;
        
        self.conn.execute(
            "UPDATE notes SET path = ?1 WHERE path = ?2",
            params![to.to_string_lossy(), from.to_string_lossy()]
        ).context("Failed to update database")?;
        Ok(())
    }

    /// Securely joins the root directory with a relative path, ensuring the result is within the root.
    fn secure_join(&self, relative_path: &Path) -> Result<PathBuf> {
        let path = self.root_dir.join(relative_path);
        // Normalize path (canonicalize requires existence, so we can't use it for new files easily)
        // Instead, we can check components.

        // Simple check: ensure no Component::ParentDir that would escape root.
        // A robust way is to use `clean` path logic or just verify it doesn't contain `..`

        for component in relative_path.components() {
            if component == Component::ParentDir {
                return Err(anyhow!("Path traversal attempt detected: {:?}", relative_path));
            }
        }

        Ok(path)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    use std::fs;

    #[test]
    fn test_store_workflow() -> Result<()> {
        let dir = tempdir()?;
        let db_path = dir.path().join("test.db");
        let notes_dir = dir.path().join("notes");
        fs::create_dir(&notes_dir)?;

        let mut store = Store::new(notes_dir.clone(), db_path)?;

        // Test Create
        store.create(Path::new("note1.md"), "content1", Some(Metadata {
            title: Some("Note 1".to_string()),
            tags: Some(vec!["tag1".to_string()]),
            created_at: None,
            updated_at: None,
            extra: Default::default(),
        }))?;

        // Test List
        let notes = store.list()?;
        assert_eq!(notes.len(), 1);
        assert_eq!(notes[0].title.as_deref(), Some("Note 1"));
        assert_eq!(notes[0].path, Path::new("note1.md"));

        // Test Get
        let note = store.get(Path::new("note1.md"))?;
        assert!(note.content.contains("content1"));
        assert_eq!(note.metadata.title.as_deref(), Some("Note 1"));
        assert_eq!(note.metadata.tags.as_deref(), Some(&vec!["tag1".to_string()][..]));

        // Test Search
        let results = store.search("Note 1")?;
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].title.as_deref(), Some("Note 1"));

        // Test Update
        store.update(Path::new("note1.md"), Some("updated content"), Some("Updated Title"))?;
        let note = store.get(Path::new("note1.md"))?;
        assert!(note.content.contains("updated content"));
        assert_eq!(note.metadata.title.as_deref(), Some("Updated Title"));

        // Verify DB updated
        let results = store.search("Updated Title")?;
        assert_eq!(results.len(), 1);

        // Test Move
        store.move_note(Path::new("note1.md"), Path::new("renamed.md"))?;
        assert!(!notes_dir.join("note1.md").exists());
        assert!(notes_dir.join("renamed.md").exists());

        let notes = store.list()?;
        assert_eq!(notes.len(), 1);
        assert_eq!(notes[0].path, Path::new("renamed.md"));

        // Test Delete
        store.delete(Path::new("renamed.md"))?;
        assert!(!notes_dir.join("renamed.md").exists());
        let notes = store.list()?;
        assert_eq!(notes.len(), 0);

        Ok(())
    }

    #[test]
    fn test_sync() -> Result<()> {
        let dir = tempdir()?;
        let db_path = dir.path().join("test.db");
        let notes_dir = dir.path().join("notes");
        fs::create_dir(&notes_dir)?;

        // Create file manually
        fs::write(notes_dir.join("manual.md"), "---\ntitle: Manual Note\n---\nBody")?;

        let mut store = Store::new(notes_dir.clone(), db_path)?;

        // Initial list should be empty
        let notes = store.list()?;
        assert_eq!(notes.len(), 0);

        store.sync()?;

        let notes = store.list()?;
        assert_eq!(notes.len(), 1);
        assert_eq!(notes[0].title.as_deref(), Some("Manual Note"));

        Ok(())
    }

    #[test]
    fn test_secure_join_traversal() -> Result<()> {
        let dir = tempdir()?;
        let db_path = dir.path().join("test.db");
        let notes_dir = dir.path().join("notes");
        fs::create_dir(&notes_dir)?;

        let store = Store::new(notes_dir, db_path)?;

        let result = store.get(Path::new("../secret.txt"));
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("Path traversal"));

        Ok(())
    }
}

#[cfg(test)]
mod initialization_tests {
    use super::*;
    use std::env;
    use std::fs;

    fn setup_temp_dir(suffix: &str) -> PathBuf {
        let mut temp_dir = env::temp_dir();
        temp_dir.push(format!("extt_test_{}_{}", std::process::id(), suffix));
        if temp_dir.exists() {
            let _ = fs::remove_dir_all(&temp_dir);
        }
        fs::create_dir_all(&temp_dir).unwrap();
        temp_dir
    }

    #[test]
    fn test_store_new_creates_parent_dir() {
        let temp_dir = setup_temp_dir("parent_dir");
        let root_dir = temp_dir.join("notes");
        let db_path = temp_dir.join("subdir/extt.db");
        fs::create_dir_all(&root_dir).unwrap();

        assert!(!db_path.parent().unwrap().exists());

        let store = Store::new(root_dir, db_path.clone()).expect("Failed to create store");

        assert!(db_path.parent().unwrap().exists());
        assert!(db_path.exists());
        drop(store);
        let _ = fs::remove_dir_all(&temp_dir);
    }

    #[test]
    fn test_store_new_opens_existing_db() {
        let temp_dir = setup_temp_dir("existing_db");
        let root_dir = temp_dir.join("notes");
        let db_path = temp_dir.join("extt.db");
        fs::create_dir_all(&root_dir).unwrap();

        {
            let _store = Store::new(root_dir.clone(), db_path.clone()).unwrap();
        }

        assert!(db_path.exists());

        let store_result = Store::new(root_dir, db_path);
        assert!(store_result.is_ok());

        drop(store_result.unwrap());
        let _ = fs::remove_dir_all(&temp_dir);
    }

    #[test]
    fn test_store_new_creates_table() {
        let temp_dir = setup_temp_dir("creates_table");
        let root_dir = temp_dir.join("notes");
        let db_path = temp_dir.join("extt.db");
        fs::create_dir_all(&root_dir).unwrap();

        let store = Store::new(root_dir, db_path).unwrap();

        let mut stmt = store.conn.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='notes'").unwrap();
        let exists = stmt.exists([]).unwrap();
        assert!(exists);

        drop(stmt); drop(store);
        let _ = fs::remove_dir_all(&temp_dir);
    }
}
