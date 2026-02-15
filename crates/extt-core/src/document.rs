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

    #[test]
    fn test_load_non_existent_file() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("non_existent.md");

        let result = Document::load(path);
        assert!(result.is_err());
    }

    #[test]
    fn test_load_empty_file() -> Result<()> {
        let dir = tempdir()?;
        let path = dir.path().join("empty.md");
        fs::write(&path, "")?;

        let doc = Document::load(path)?;
        assert_eq!(doc.content, "");
        assert!(doc.frontmatter.is_none());
        Ok(())
    }

    #[test]
    fn test_load_no_frontmatter() -> Result<()> {
        let dir = tempdir()?;
        let path = dir.path().join("no_fm.md");
        let content = "# Just content\nNo frontmatter here.";
        fs::write(&path, content)?;

        let doc = Document::load(path)?;
        assert_eq!(doc.content, content);
        assert!(doc.frontmatter.is_none());
        Ok(())
    }

    #[test]
    fn test_load_only_frontmatter() -> Result<()> {
        let dir = tempdir()?;
        let path = dir.path().join("only_fm.md");
        let content = "---\ntitle: Only FM\n---";
        fs::write(&path, content)?;

        let doc = Document::load(path)?;
        assert_eq!(doc.content.trim(), "");
        let fm = doc.frontmatter.unwrap();
        assert_eq!(fm["title"], "Only FM");
        Ok(())
    }

    #[test]
    fn test_load_invalid_frontmatter() -> Result<()> {
        let dir = tempdir()?;
        let path = dir.path().join("invalid_fm.md");
        // Invalid YAML in frontmatter block
        let content = "---\ntitle: : invalid\n---\nContent";
        fs::write(&path, content)?;

        let doc = Document::load(path.clone())?;
        // We just want to ensure it loaded without error (i.e., not crashing).
        // Frontmatter might be None, Null, or even parsed leniently.
        // The important part is that `Document::load` handles it gracefully.
        assert!(doc.content.contains("Content"));

        // Try tab indentation which YAML strictly forbids.
        // This often causes parsing errors in strict parsers.
        let content_tabs = "---\ntitle:\n\tinvalid\n---\nContent";
        fs::write(&path, content_tabs)?;

        let doc_tabs = Document::load(path)?;
        // In this case, gray_matter (via yaml-rust) might return Null or None.
        if let Some(fm) = doc_tabs.frontmatter {
             // If it returns something, it should probably be Null if it couldn't parse structure,
             // or it parsed it as something valid (which is surprising for tabs, but possible).
             // We accept Null as "parsed but empty/invalid".
             if !fm.is_null() {
                 // If it's not null, it managed to parse something.
                 // We just want to ensure we didn't panic.
             }
        }

        Ok(())
    }

    #[test]
    fn test_load_complex_frontmatter() -> Result<()> {
        let dir = tempdir()?;
        let path = dir.path().join("complex.md");
        let content = r#"---
title: Complex
metadata:
  created: 2023-01-01
  tags:
    - a
    - b
  nested:
    key: value
---
Content"#;
        fs::write(&path, content)?;

        let doc = Document::load(path)?;
        let fm = doc.frontmatter.unwrap();

        assert_eq!(fm["title"], "Complex");
        assert_eq!(fm["metadata"]["tags"][0], "a");
        assert_eq!(fm["metadata"]["nested"]["key"], "value");
        Ok(())
    }

    #[test]
    fn test_utf8_content() -> Result<()> {
        let dir = tempdir()?;
        let path = dir.path().join("utf8.md");
        let content = r#"---
title: "Заголовок"
---
# Привет, мир!
Emojis: 🚀🦀"#;
        fs::write(&path, content)?;

        let doc = Document::load(path)?;
        let fm = doc.frontmatter.unwrap();

        assert_eq!(fm["title"], "Заголовок");
        assert!(doc.content.contains("Привет, мир!"));
        assert!(doc.content.contains("🚀🦀"));
        Ok(())
    }
}
