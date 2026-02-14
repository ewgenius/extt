use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use anyhow::Result;

const DEFAULT_APP_NAME: &str = "extt";

fn default_notes_dir() -> PathBuf {
    dirs::home_dir().unwrap_or_else(|| PathBuf::from(".")).join("Notes")
}

fn default_db_path() -> PathBuf {
    let config_dir = dirs::config_dir()
        .map(|d| d.join(DEFAULT_APP_NAME))
        .unwrap_or_else(|| PathBuf::from("."));
    config_dir.join("index.db")
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    #[serde(default = "default_notes_dir")]
    pub notes_dir: PathBuf,
    #[serde(default = "default_db_path")]
    pub db_path: PathBuf,
    #[serde(default)]
    pub vault_path: String,
    #[serde(default)]
    pub theme: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            notes_dir: default_notes_dir(),
            db_path: default_db_path(),
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

    pub fn get_path() -> Result<PathBuf> {
        Ok(confy::get_configuration_file_path("extt", "config")?)
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
