import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";

type CustomText = { text: string; bold?: true };
type ElementType =
  | "heading-one"
  | "heading-two"
  | "heading-three"
  | "heading-four"
  | "paragraph"
  | "bold"
  | "italic"
  | "blockquote"
  | "code";

type CustomElement = { type: ElementType; children: CustomText[] };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
