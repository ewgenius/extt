use gpui::*;

pub struct Editor {
    pub content: String,
    pub focus_handle: FocusHandle,
}

impl Editor {
    pub fn new(content: String, cx: &mut Context<Self>) -> Self {
        Self {
            content,
            focus_handle: cx.focus_handle(),
        }
    }

    pub fn update_content(&mut self, content: String, cx: &mut Context<Self>) {
        self.content = content;
        cx.notify();
    }
}

impl Render for Editor {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        let focus_handle = self.focus_handle.clone();
        
        div()
            .track_focus(&focus_handle)
            .on_key_down(cx.listener(|this, event: &KeyDownEvent, _window, cx| {
                let keystroke = &event.keystroke;
                if keystroke.key == "backspace" {
                    this.content.pop();
                    cx.notify();
                } else if keystroke.key == "enter" {
                    this.content.push('\n');
                    cx.notify();
                } else if let Some(char) = &keystroke.key_char {
                     this.content.push_str(char);
                     cx.notify();
                } else if keystroke.key.len() == 1 && !keystroke.modifiers.platform && !keystroke.modifiers.control && !keystroke.modifiers.alt {
                     this.content.push_str(&keystroke.key);
                     cx.notify();
                }
            }))
            .size_full()
            .p_4()
            .text_sm()
            .font_family("TX-02")
            .text_color(rgb(0x000000))
            .child(self.content.clone())
    }
}
