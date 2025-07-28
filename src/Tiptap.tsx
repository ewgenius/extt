// src/Tiptap.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";

// define your extension array
const extensions = [StarterKit, Typography];

const content = "<p>Hello World!</p>";

export const Tiptap = () => {
  const editor = useEditor({
    extensions,
    content,
  });

  return (
    <div className="container mx-auto max-w-7xl text-base">
      <EditorContent
        className="w-full h-full p-8 !outline-0 prose prose-sm"
        editor={editor}
      />
      <FloatingMenu
        editor={editor}
        className="rounded-md text-xs p-1 flex items-center gap-1 bg-white shadow-sm"
      >
        <button className="border border-gray-200 p-1 rounded-sm">test</button>
        <button className="border border-gray-200 p-1 rounded-sm">test</button>
        <button className="border border-gray-200 p-1 rounded-sm">test</button>
      </FloatingMenu>

      <BubbleMenu
        editor={editor}
        className="rounded-md text-xs p-1 flex items-center gap-1 bg-white shadow-sm"
      >
        <button className="border border-gray-200 p-1 rounded-sm">test</button>
        <button className="border border-gray-200 p-1 rounded-sm">test</button>
        <button className="border border-gray-200 p-1 rounded-sm">test</button>
      </BubbleMenu>
    </div>
  );
};
