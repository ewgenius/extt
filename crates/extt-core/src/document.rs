use std::path::PathBuf;
use gray_matter::Matter;
use gray_matter::engine::YAML;

use anyhow::{Result, Context};
use std::fs;

#[derive(Debug, Clone)]
pub struct Document {
    pub path: PathBuf,
    pub frontmatter: Option<serde_json::Value>,
    pub content: String,
}

impl Document {
    pub fn load(path: PathBuf) -> Result<Self> {
        let file_content = fs::read_to_string(&path)
            .with_context(|| format!("Failed to read file: {:?}", path))?;
        
        let matter = Matter::<YAML>::new();
        let result = matter.parse(&file_content);

        Ok(Self {
            path,
            frontmatter: result.data.and_then(|pod| pod.deserialize().ok()),
            content: result.content,
        })
    }
}
