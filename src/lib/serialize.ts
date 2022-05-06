import { CustomElement, CustomText } from "#/typings";
import { Descendant, Text } from "slate";

// Define a serializing function that takes a value and returns a string.
export function serializeNode(node: Descendant): string {
  if (Text.isText(node)) {
    if (node.bold) {
      return `**${node.text}**`;
    }
    if (node.italic) {
      return `*${node.text}*`;
    }
    if (node.code) {
      return "`" + node.text + "`";
    }
    if (node.href) {
      return `[${node.text}](${node.href})`;
    }

    return node.text;
  } else {
    const children = node.children.map((n) => serializeNode(n)).join("");

    switch (node.type) {
      case "heading-one":
        return `# ${children}`;

      case "heading-two":
        return `## ${children}`;

      case "heading-three":
        return `### ${children}`;

      case "heading-four":
        return `#### ${children}`;

      case "blockquote":
        return `> ${children}`;

      case "strong":
        return `**${children}**`;

      case "italic":
        return `*${children}*`;

      case "code":
      case "paragraph":
      default:
        return children;
    }
  }
}

export function serialize(nodes: Descendant[]): string {
  return nodes.map((node) => serializeNode(node)).join("\n");
}
