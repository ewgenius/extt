use std::path::PathBuf;
use gray_matter::Matter;
use gray_matter::engine::YAML;
use anyhow::{Result, Context};
use std::fs;

/// Represents a parsed markdown document with optional frontmatter.
#[derive(Debug, Clone)]
pub struct Document {
    /// The path to the document file.
    pub path: PathBuf,
    /// The raw frontmatter as a JSON value, if present.
    pub frontmatter: Option<serde_json::Value>,
    /// The markdown content of the document.
    pub content: String,
}

impl Document {
    /// Loads and parses a markdown file from the given path.
    ///
    /// # Arguments
    ///
    /// * `path` - A `PathBuf` pointing to the markdown file.
    ///
    /// # Returns
    ///
    /// Returns a `Result` containing the `Document` if successful, or an error if reading fails.
    ///
    /// # Example
    ///
    /// ```no_run
    /// use std::path::PathBuf;
    /// use extt_core::Document;
    ///
    /// let doc = Document::load(PathBuf::from("note.md")).unwrap();
    /// println!("Content: {}", doc.content);
    /// ```
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

    #[test]
    fn test_document_no_frontmatter() -> Result<()> {
        let dir = tempdir()?;
        let path = dir.path().join("simple.md");
        fs::write(&path, "Just content")?;

        let doc = Document::load(path)?;
        assert_eq!(doc.content, "Just content");
        assert!(doc.frontmatter.is_none());

        Ok(())
    }

    #[test]
    fn test_document_empty_frontmatter() -> Result<()> {
        let dir = tempdir()?;
        let path = dir.path().join("empty_fm.md");
        let content = r#"---
---
Just content"#;
        fs::write(&path, content)?;

        let doc = Document::load(path)?;
        assert_eq!(doc.content.trim(), "Just content");
        // gray_matter might return None or empty object depending on implementation
        // For empty `--- ---`, it usually returns None or empty map.
        // Let's check what it does.
        if let Some(fm) = doc.frontmatter {
             assert!(fm.as_object().map(|o| o.is_empty()).unwrap_or(true));
        }

        Ok(())
    }
}
