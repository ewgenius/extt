// src/Tiptap.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import { Button } from "./components/ui/button";

// define your extension array
const extensions = [StarterKit, Typography];

const content = "<p>Hello World!</p>";

export const Tiptap = () => {
  const editor = useEditor({
    extensions,
    content,
  });

  return (
    <div className="container mx-auto max-w-6xl text-base">
      <EditorContent
        className="w-full h-full p-4 pt-0 !outline-0 prose prose-sm dark:prose-invert"
        editor={editor}
      />
      <FloatingMenu
        editor={editor}
        className="rounded-lg text-xs p-1 flex items-center gap-1 bg-popover text-popover-foreground border shadow-md"
      >
        <Button variant="outline" size="sm">
          test
        </Button>
        <Button variant="outline" size="sm">
          test
        </Button>
        <Button variant="outline" size="sm">
          test
        </Button>
      </FloatingMenu>

      <BubbleMenu
        editor={editor}
        className="rounded-lg text-xs p-1 flex items-center gap-1 bg-popover text-popover-foreground border shadow-md"
      >
        <Button variant="outline" size="sm">
          test
        </Button>
        <Button variant="outline" size="sm">
          test
        </Button>
        <Button variant="outline" size="sm">
          test
        </Button>
      </BubbleMenu>
    </div>
  );
};
