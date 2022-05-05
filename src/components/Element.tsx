import { FC } from "react";
import { RenderElementProps } from "slate-react";

export const Element: FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  switch (element.type) {
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;

    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;

    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;

    case "heading-four":
      return <h4 {...attributes}>{children}</h4>;

    case "paragraph":
      return <p {...attributes}>{children}</p>;

    case "strong":
      return <strong {...attributes}>{children}</strong>;

    case "blockquote":
      return <blockquote {...attributes}>{children}</blockquote>;

    case "code":
      return <pre {...attributes}>{children}</pre>;

    default:
      return <p>{children}</p>;
  }
};
