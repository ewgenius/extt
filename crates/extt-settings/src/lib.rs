use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use anyhow::Result;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub vault_path: String,
    pub theme: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            vault_path: String::from("."),
            theme: String::from("Dark"),
        }
    }
}

impl Settings {
    pub fn load() -> Result<Self> {
        // For now, simple confy load or similar. 
        // We will use standard confy behavior for "extt"
        Ok(confy::load("extt", "config")?)
    }

    pub fn save(&self) -> Result<()> {
        confy::store("extt", "config", self)?;
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Theme {
    pub name: String,
    pub colors: ThemeColors,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThemeColors {
    pub bg_base: String,
    pub text_base: String,
}
