mod colors;
// mod config;
mod extt;
mod editor;

use std::{fs, path::PathBuf};

use anyhow::Result;
use gpui::{
    actions, point, prelude::*, px, App, Application, AssetSource, KeyBinding, SharedString,
    TitlebarOptions, WindowKind, WindowOptions,
};

use extt_settings::Settings;
use crate::extt::AppWindow;

actions!(window, [Quit]);

struct Assets {
    base: PathBuf,
}

impl AssetSource for Assets {
    fn load(&self, path: &str) -> Result<Option<std::borrow::Cow<'static, [u8]>>> {
        fs::read(self.base.join(path))
            .map(|data| Some(std::borrow::Cow::Owned(data)))
            .map_err(|e| e.into())
    }

    fn list(&self, path: &str) -> Result<Vec<SharedString>> {
        fs::read_dir(self.base.join(path))
            .map(|entries| {
                entries
                    .filter_map(|entry| {
                        entry
                            .ok()
                            .and_then(|entry| entry.file_name().into_string().ok())
                            .map(SharedString::from)
                    })
                    .collect()
            })
            .map_err(|e| e.into())
    }
}

fn load() -> Settings {
    let config = match Settings::load() {
        Ok(config) => config,
        Err(e) => {
            eprintln!("Failed to load config: {}", e);
            Settings::default()
        }
    };

    dbg!(&config);

    return config;
}

fn main() {
    let settings = load();

    Application::new()
        .with_assets(Assets {
            base: PathBuf::from(env!("CARGO_MANIFEST_DIR")),
        })
        .run(move |cx: &mut App| {
            cx.open_window(
                WindowOptions {
                    window_bounds: None,
                    titlebar: Some(TitlebarOptions {
                        title: None,
                        appears_transparent: true,
                        traffic_light_position: Some(point(px(9.0), px(9.0))),
                    }),
                    kind: WindowKind::Normal,
                    is_movable: true,
                    window_min_size: Some(gpui::Size {
                        width: px(1024.0),
                        height: px(640.0),
                    }),
                    ..Default::default()
                },
                move |_window, cx| {
                    let vault = extt_core::Vault::new(&settings.vault_path);
                    let workspace = cx.new(|_cx| crate::extt::Workspace {
                        vault,
                        settings: settings.clone(),
                        active_document: None,
                        active_editor: None,
                    });
                    
                    cx.new(|_cx| AppWindow::new(workspace))
                },
            )
            .unwrap();

            cx.activate(true);
            cx.on_action(|_: &Quit, cx| cx.quit());
            cx.bind_keys([KeyBinding::new("cmd-q", Quit, None)]);
        });
}
