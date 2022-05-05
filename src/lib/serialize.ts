import { Descendant, Node } from "slate";

// Define a serializing function that takes a value and returns a string.
export function serialize(value: Descendant[]): string {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map((n) => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join("\n")
  );
}
