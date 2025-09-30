use gpui::{App, Context, FontWeight, SharedString, Window, div, prelude::*, rgb, svg};

// use gpui_component::{
//     ActiveTheme, Disableable as _, Icon, IconName, Selectable as _, Sizable as _, Theme,
//     button::{Button, ButtonCustomVariant, ButtonGroup, ButtonVariants as _, DropdownButton},
//     checkbox::Checkbox,
//     h_flex, v_flex,
// };

use crate::colors::BASE;

fn sidebar_item(path: &str) -> impl IntoElement {
    div()
        .id(SharedString::from(path.to_string()))
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
        .child(path.to_string())
}

pub struct AppWindow {}

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
                    .child(sidebar_item("root"))
                    .child(sidebar_item("my-note-1.md"))
                    .child(sidebar_item("my-note-2.md"))
                    .child(sidebar_item("my-note-3.md"))
                    .child(sidebar_item("my-note-4.md"))
                    .child(sidebar_item("my-note-5.md"))
                    .child(sidebar_item("my-note-6.md"))
            )
            .child(
                div()
                    .flex_1()
                    .flex()
                    .flex_col()
                    .items_start()
                    .gap_2()
                    .p_4()
                    .child(div().child(concat!(
                        env!("CARGO_MANIFEST_DIR"),
                        "/assets/icons/folder.svg"
                    )))
                    // .child(Button::new("test").label("test"))
                    .child(div().child("/Users/evgenii/Developer/BitBroz/EXTT/extt/crates/extt/assets/icons/folder.svg"))
                    .child(div().child("Lorem ipsum dolor sit amet, consectetur adipiscing elit."))
                    .child(div().child("Lorem ipsum dolor sit amet, consectetur adipiscing elit."))
                    .child(div().child("Lorem ipsum dolor sit amet, consectetur adipiscing elit."))
                    .child(div().child("Lorem ipsum dolor sit amet, consectetur adipiscing elit."))
                    .child(div().child("Lorem ipsum dolor sit amet, consectetur adipiscing elit."))
                    .child(div().child("Lorem ipsum dolor sit amet, consectetur adipiscing elit."))
                    .child(div().child("Lorem ipsum dolor sit amet, consectetur adipiscing elit."))
                    .child(div().child("Lorem ipsum dolor sit amet, consectetur adipiscing elit."))
                    .child(div().child("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")),
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
