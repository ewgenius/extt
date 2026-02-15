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

        // Convert Pod to serde_json::Value manually or via string if needed.
        // gray_matter 0.2 `Pod` can deserialize into serde structures.
        let frontmatter = result.data.and_then(|pod| pod.deserialize().ok());

        Ok(Self {
            path,
            frontmatter,
            content: result.content,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    use std::fs;

    #[test]
    fn test_document_parsing() -> Result<()> {
        let dir = tempdir()?;
        let path = dir.path().join("test.md");

        let content = r#"---
title: Test Note
tags: [test, notes]
---
# Hello World
This is a test note.
"#;
        fs::write(&path, content)?;

        let doc = Document::load(path.clone())?;

        assert_eq!(doc.content.trim(), "# Hello World\nThis is a test note.");

        let fm = doc.frontmatter.unwrap();
        assert_eq!(fm["title"], "Test Note");
        assert_eq!(fm["tags"][0], "test");
        assert_eq!(fm["tags"][1], "notes");

        Ok(())
    }
}
