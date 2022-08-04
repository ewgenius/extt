#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::path::PathBuf;
use std::str::FromStr;
use tauri_plugin_store::{PluginBuilder, StoreBuilder};
use tauri_plugin_fs_watch::Watcher;

fn main() {
  let settings = StoreBuilder::new(PathBuf::from_str(".settings.dat").unwrap()).build();

  tauri::Builder::default()
    .plugin(PluginBuilder::default().stores([settings]).freeze().build())
    .plugin(Watcher::default())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
