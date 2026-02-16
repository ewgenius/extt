use std::path::{Path, PathBuf};
use walkdir::WalkDir;


#[derive(Debug, Clone)]
pub struct Vault {
    path: PathBuf,
    files: Vec<PathBuf>,
}

impl Vault {
    pub fn new(path: impl Into<PathBuf>) -> Self {
        let path = path.into();
        let mut vault = Self { path, files: Vec::new() };
        vault.refresh();
        vault
    }

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
    
    pub fn files(&self) -> &[PathBuf] {
        &self.files
    }

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
    fn test_vault_init_non_existent() {
        let temp = tempdir().unwrap();
        let non_existent = temp.path().join("does_not_exist");
        let vault = Vault::new(&non_existent);
        assert!(vault.files().is_empty());
        assert_eq!(vault.root(), non_existent.as_path());
    }

    #[test]
    fn test_vault_refresh_updates_files() {
        let dir = tempdir().unwrap();
        let root = dir.path();
        let mut vault = Vault::new(root);
        assert!(vault.files().is_empty());

        // Add a file
        let file1 = root.join("test1.md");
        fs::write(&file1, "content").unwrap();

        vault.refresh();
        assert_eq!(vault.files().len(), 1);
        assert_eq!(vault.files()[0], file1);

        // Remove the file
        fs::remove_file(&file1).unwrap();
        vault.refresh();
        assert!(vault.files().is_empty());
    }

    #[test]
    fn test_vault_extensions() {
        let dir = tempdir().unwrap();
        let root = dir.path();

        fs::write(root.join("valid.md"), "").unwrap();
        fs::write(root.join("valid.txt"), "").unwrap();
        fs::write(root.join("invalid.pdf"), "").unwrap();
        fs::write(root.join("invalid.png"), "").unwrap();
        fs::write(root.join("no_extension"), "").unwrap();

        let vault = Vault::new(root);
        let files = vault.files();

        assert_eq!(files.len(), 2);
        assert!(files.contains(&root.join("valid.md")));
        assert!(files.contains(&root.join("valid.txt")));
        assert!(!files.contains(&root.join("invalid.pdf")));
        assert!(!files.contains(&root.join("invalid.png")));
        assert!(!files.contains(&root.join("no_extension")));
    }

    #[test]
    fn test_vault_hidden_files() {
        let dir = tempdir().unwrap();
        let root = dir.path();

        // Hidden file with valid extension should be included
        fs::write(root.join(".hidden.md"), "content").unwrap();
        // Hidden file with invalid extension should be excluded
        fs::write(root.join(".hidden.pdf"), "content").unwrap();
        // Hidden file with no extension should be excluded
        fs::write(root.join(".git"), "content").unwrap();

        let vault = Vault::new(root);
        let files = vault.files();

        assert_eq!(files.len(), 1);
        assert!(files.contains(&root.join(".hidden.md")));
    }
}
