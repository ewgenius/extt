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
}
