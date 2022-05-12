import { FC, useEffect, useRef, useState } from "react";
import { RenderElementProps } from "slate-react";
import { Menu, Portal } from "@headlessui/react";
import { MenuIcon, ViewListIcon } from "@heroicons/react/outline";

function CommandMenu() {
  const button = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (button.current) {
      const rect = button.current.getBoundingClientRect();

      setOffset({
        x: rect.left,
        y: rect.top,
      });
    }
  }, []);

  return (
    <div className="absolute -left-10 top-0 select-none z-10">
      <Menu>
        {() => (
          <>
            <Menu.Button
              ref={button}
              className="outline-none p-2 opacity-0 group-hover:opacity-80 transition-opacity duration-300"
            >
              <MenuIcon className="w-4 h-4" />
            </Menu.Button>

            <Portal>
              <Menu.Items
                className="ml-2 py-1 max-w-xs outline-none bg-stone-100 dark:bg-stone-800 rounded-md shadow-md z-10 flex flex-col text-xs overflow-hidden"
                style={{
                  marginTop: 40 + offset.y,
                  marginLeft: offset.x,
                }}
              >
                <Menu.Item>
                  <button className="px-3 py-2 flex gap-2 items-center hover:bg-stone-200 dark:hover:bg-stone-700">
                    <div className="w-3 h-3 flex justify-center items-center text-md font-bold">
                      H
                    </div>
                    heading 1
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="px-3 py-2 flex gap-2 items-center hover:bg-stone-200 dark:hover:bg-stone-700">
                    <div className="w-3 h-3 flex justify-center items-center text-xs font-bold">
                      H
                    </div>
                    heading 2
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="px-3 py-2 flex gap-2 items-center hover:bg-stone-200 dark:hover:bg-stone-700">
                    <div className="w-3 h-3 flex justify-center items-center font-bold">
                      T
                    </div>
                    text
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="px-3 py-2 flex gap-2 items-center hover:bg-stone-200 dark:hover:bg-stone-700">
                    <div className="w-3 h-3 flex justify-center items-center font-bold">
                      B
                    </div>
                    bold
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="px-3 py-2 flex gap-2 items-center hover:bg-stone-200 dark:hover:bg-stone-700">
                    <div className="w-3 h-3 flex justify-center items-center italic font-bold">
                      I
                    </div>
                    italic
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="px-3 py-2 flex gap-2 items-center hover:bg-stone-200 dark:hover:bg-stone-700">
                    <ViewListIcon className="w-3 h-3 text-current" />
                    list
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Portal>
          </>
        )}
      </Menu>
    </div>
  );
}

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

    case "command":
      return (
        <div className="relative">
          <p>{children}</p>
        </div>
      );

    default:
      return <p>{children}</p>;
  }
};

export const ElementWithMenu: FC<RenderElementProps> = (props) => {
  return (
    <div className="relative group z-0">
      <Element {...props} />
      <CommandMenu />
    </div>
  );
};
