use serde::{Deserialize, Serialize};
use std::path::PathBuf;

/// Represents metadata associated with a note, typically extracted from YAML frontmatter.
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Metadata {
    /// The title of the note.
    pub title: Option<String>,
    /// A list of tags associated with the note.
    pub tags: Option<Vec<String>>,
    /// The creation timestamp (as a string).
    pub created_at: Option<String>,
    /// The last updated timestamp (as a string).
    pub updated_at: Option<String>,
    /// Any additional fields found in the frontmatter.
    #[serde(flatten)]
    pub extra: std::collections::HashMap<String, serde_json::Value>,
}

/// Represents a complete note, including its file path, metadata, and content.
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Note {
    /// The absolute or relative path to the note file.
    pub path: PathBuf,
    /// The metadata extracted from the note's frontmatter.
    pub metadata: Metadata,
    /// The markdown content of the note (excluding frontmatter).
    pub content: String,
}

/// A lightweight summary of a note, suitable for listing or searching.
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct NoteSummary {
    /// The path to the note file.
    pub path: PathBuf,
    /// The title of the note, if available.
    pub title: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_metadata_serialization() {
        let metadata = Metadata {
            title: Some("Test Note".to_string()),
            tags: Some(vec!["rust".to_string(), "testing".to_string()]),
            created_at: None,
            updated_at: None,
            extra: Default::default(),
        };

        let yaml = serde_yaml::to_string(&metadata).unwrap();
        assert!(yaml.contains("title: Test Note"));
        assert!(yaml.contains("tags:"));
        assert!(yaml.contains("- rust"));
        assert!(yaml.contains("- testing"));

        let deserialized: Metadata = serde_yaml::from_str(&yaml).unwrap();
        assert_eq!(deserialized, metadata);
    }
}
