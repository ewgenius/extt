import { Descendant } from "slate";
import { marked } from "marked";
import { CustomText } from "../typings";

function getHeadingType(
  token: marked.Tokens.Heading
): "heading-one" | "heading-two" | "heading-three" | "heading-four" {
  return ["heading-one", "heading-two", "heading-three", "heading-four"][
    token.depth - 1
  ] as "heading-one" | "heading-two" | "heading-three" | "heading-four";
}

function processLeafs(tokens: marked.Token[]): CustomText[] {
  return tokens.map((t) => {
    // console.log(t);
    switch (t.type) {
      case "strong": {
        return {
          text: t.text,
          bold: true,
        };
      }

      case "em": {
        return {
          text: t.text,
          italic: true,
        };
      }

      case "codespan": {
        return {
          text: t.text,
          code: true,
        };
      }

      case "link": {
        return {
          text: t.text,
          href: t.href,
        };
      }

      default:
        return {
          text: t.raw,
        };
    }
  });
}

export function deserialize(str: string): Descendant[] {
  return marked.lexer(str).reduce<Descendant[]>((arr, token) => {
    switch (token.type) {
      case "heading":
        return [
          ...arr,
          {
            type: getHeadingType(token),
            children: processLeafs(token.tokens),
          },
        ];

      case "paragraph":
        return [
          ...arr,
          {
            type: "paragraph",
            children: processLeafs(token.tokens),
          },
        ];

      case "strong":
        return [
          ...arr,
          {
            type: "strong",
            children: processLeafs(token.tokens),
          },
        ];

      case "code":
        return [
          ...arr,
          {
            type: "code",
            children: [
              {
                text: token.raw,
              },
            ],
          },
        ];

      case "blockquote":
        return [
          ...arr,
          {
            type: "blockquote",
            children: [
              {
                text: token.text,
              },
            ],
          },
        ];
    }

    return arr;
  }, []);
}
