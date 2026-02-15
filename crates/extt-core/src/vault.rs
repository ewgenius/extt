use std::path::{Path, PathBuf};
use walkdir::WalkDir;


/// Represents a collection of notes within a directory.
///
/// A `Vault` scans a directory for markdown (`.md`) and text (`.txt`) files
/// and maintains a list of their paths.
#[derive(Debug, Clone)]
pub struct Vault {
    path: PathBuf,
    files: Vec<PathBuf>,
}

impl Vault {
    /// Creates a new `Vault` rooted at the given path and performs an initial scan.
    ///
    /// # Arguments
    ///
    /// * `path` - The root directory of the vault.
    pub fn new(path: impl Into<PathBuf>) -> Self {
        let path = path.into();
        let mut vault = Self { path, files: Vec::new() };
        vault.refresh();
        vault
    }

    /// Rescans the vault directory for files, updating the internal list.
    ///
    /// This method recursively walks the directory and filters for files
    /// with `.md` or `.txt` extensions.
    pub fn refresh(&mut self) {
        self.files = WalkDir::new(&self.path)
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.file_type().is_file())
            .filter(|e| e.path().extension().map_or(false, |ext| ext == "md" || ext == "txt"))
            .map(|e| e.path().to_path_buf())
            .collect();
        self.files.sort();
    }
    
    /// Returns a slice of paths to the files found in the vault.
    pub fn files(&self) -> &[PathBuf] {
        &self.files
    }

    /// Returns the root path of the vault.
    pub fn root(&self) -> &Path {
        &self.path
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    use std::fs;

    #[test]
    fn test_vault_listing() {
        let dir = tempdir().unwrap();
        let root = dir.path();

        fs::write(root.join("note1.md"), "content1").unwrap();
        fs::write(root.join("note2.txt"), "content2").unwrap();
        fs::write(root.join("ignore.pdf"), "content3").unwrap();
        fs::create_dir(root.join("subdir")).unwrap();
        fs::write(root.join("subdir/note3.md"), "content3").unwrap();

        let vault = Vault::new(root);
        let files = vault.files();

        assert_eq!(files.len(), 3);
        assert!(files.contains(&root.join("note1.md")));
        assert!(files.contains(&root.join("note2.txt")));
        assert!(files.contains(&root.join("subdir/note3.md")));
        assert!(!files.contains(&root.join("ignore.pdf")));
    }

    #[test]
    fn test_vault_refresh() {
        let dir = tempdir().unwrap();
        let root = dir.path();

        fs::create_dir(root.join("subdir")).unwrap();
        let mut vault = Vault::new(root);
        assert_eq!(vault.files().len(), 0);

        fs::write(root.join("new_note.md"), "content").unwrap();
        vault.refresh();

        assert_eq!(vault.files().len(), 1);
        assert!(vault.files().contains(&root.join("new_note.md")));
    }
}
