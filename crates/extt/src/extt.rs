use gpui::{App, Context, FontWeight, SharedString, Window, div, prelude::*, rgb, svg};

// use gpui_component::{
//     ActiveTheme, Disableable as _, Icon, IconName, Selectable as _, Sizable as _, Theme,
//     button::{Button, ButtonCustomVariant, ButtonGroup, ButtonVariants as _, DropdownButton},
//     checkbox::Checkbox,
//     h_flex, v_flex,
// };

use crate::colors::BASE;
use extt_core::{Vault, Document};
use extt_settings::Settings;
use std::path::PathBuf;
use gpui::*;
// use gpui_component::input::Input;

pub struct Workspace {
    pub vault: Vault,
    pub settings: Settings,
    pub active_document: Option<Document>,
}

impl Workspace {
    pub fn open_document(&mut self, path: PathBuf, cx: &mut Context<Self>) {
        if let Ok(doc) = Document::load(path) {
            self.active_document = Some(doc);
            cx.notify();
        } else {
            eprintln!("Failed to load document");
        }
    }
}

fn sidebar_item(path: PathBuf, workspace: &Entity<Workspace>) -> impl IntoElement {
    let _path_clone = path.clone();
    let _workspace_clone = workspace.clone();
    
    let file_name = path.file_name().unwrap_or_default().to_str().unwrap_or("unknown").to_string();

    div()
        .id(SharedString::from(file_name.clone()))
        .flex()
        .gap_2()
        .px_3()
        .py_0p5()
        .items_center()
        .text_color(BASE.shade(11))
        .cursor_pointer()
        .hover(|this| this.bg(BASE.shade(4)))
        .active(|this| this.bg(BASE.shade(5)))
        .child(svg().text_color(BASE.shade(11)).size_4().path(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/assets/icons/file.svg"
        )))
        .child(file_name)
        .on_click(move |_, _, cx| {
             let path = path_clone.clone();
             workspace_clone.update(cx, |workspace, cx| {
                 workspace.open_document(path, cx);
             });
        })
}

pub struct AppWindow {
    workspace: Entity<Workspace>,
}

impl AppWindow {
    pub fn new(workspace: Entity<Workspace>) -> Self {
        Self { workspace }
    }
}

impl Render for AppWindow {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .justify_start()
            .items_start()
            .bg(BASE.shade(1))
            .text_color(BASE.shade(12))
            .size_full()
            .max_w_full()
            .text_sm()
            .font_family("TX-02")
            .child(
                div()
                    .bg(BASE.shade(2))
                    .flex_shrink_0()
                    .pt_8()
                    .flex()
                    .flex_col()
                    .h_full()
                    .w_48()
                    .border_r_1()
                    .border_color(BASE.shade(4))
                    .children(
                        {
                            let files = self.workspace.read(cx).vault.files().to_vec();
                            files.into_iter().map(|path| {
                                sidebar_item(path, &self.workspace)
                            })
                        }
                    )
            )
            .child(
                div()
                    .flex_1()
                    .flex()
                    .flex_col()
                    .items_start()
                    .gap_2()
                    .p_4()
                    .child(
                        if let Some(doc) = &self.workspace.read(cx).active_document {
                            let content = doc.content.clone();
                            div().child(content)
                        } else {
                             div().child("Select a file to view")
                        }
                    )
            )
            .child(
                div()
                    .flex_shrink_0()
                    .bg(BASE.shade(2))
                    .p_4()
                    .h_full()
                    .flex()
                    .flex_col()
                    .items_start()
                    .content_stretch()
                    .w_96()
                    .border_l_1()
                    .border_color(BASE.shade(4))
                    .child(div().flex_1())
                    .child(
                        div()
                            .h_24()
                            .p_2()
                            .flex_shrink_0()
                            .border_1()
                            .border_color(BASE.shade(4))
                            .bg(BASE.shade(1))
                            .w_full()
                            .rounded_xl()
                            .flex()
                            .flex_col()
                            .items_end()
                            .justify_end()
                            .child(
                                div()
                                    .flex()
                                    .flex_col()
                                    .items_center()
                                    .justify_center()
                                    .size_7()
                                    .rounded_full()
                                    .bg(BASE.shade(6))
                                    .text_color(rgb(0xffffff))
                                    .text_lg()
                                    .child("↑"),
                            ),
                    ),
            )
    }
}

fn button(text: &str, on_click: impl Fn(&mut Window, &mut App) + 'static) -> impl IntoElement {
    div()
        .id(SharedString::from(text.to_string()))
        .flex()
        .items_center()
        .px_2()
        .py_1()
        .bg(BASE.shade(3))
        .text_sm()
        .hover(|this| this.bg(BASE.shade(4)).border_color(BASE.shade(8)))
        .active(|this| this.bg(BASE.shade(5)).border_color(BASE.shade(8)))
        .border_1()
        .border_color(BASE.shade(7))
        .rounded_sm()
        .cursor_pointer()
        .child(text.to_string())
        .on_click(move |_, window, cx| on_click(window, cx))
}
