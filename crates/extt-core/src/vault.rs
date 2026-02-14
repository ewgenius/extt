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
