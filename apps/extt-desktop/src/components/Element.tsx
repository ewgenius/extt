import { FC, useEffect, useRef, useState } from "react";
import { RenderElementProps } from "slate-react";
// import { Menu, Portal } from "@headlessui/react";
// import { MenuIcon, ViewListIcon } from "@heroicons/react/outline";

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
    <div className="absolute -left-10 top-0 z-10 select-none">
      {/* <Menu>
        {() => (
          <>
            <Menu.Button
              ref={button}
              className="p-2 opacity-0 outline-none transition-opacity duration-300 group-hover:opacity-80"
            >
              <MenuIcon className="h-4 w-4" />
            </Menu.Button>

            <Portal>
              <Menu.Items
                className="z-10 ml-2 flex max-w-xs flex-col overflow-hidden rounded-md bg-stone-100 py-1 text-xs shadow-md outline-none dark:bg-stone-800"
                style={{
                  marginTop: 40 + offset.y,
                  marginLeft: offset.x,
                }}
              >
                <Menu.Item>
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-200 dark:hover:bg-stone-700">
                    <div className="text-md flex h-3 w-3 items-center justify-center font-bold">
                      H
                    </div>
                    heading 1
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-200 dark:hover:bg-stone-700">
                    <div className="flex h-3 w-3 items-center justify-center text-xs font-bold">
                      H
                    </div>
                    heading 2
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-200 dark:hover:bg-stone-700">
                    <div className="flex h-3 w-3 items-center justify-center font-bold">
                      T
                    </div>
                    text
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-200 dark:hover:bg-stone-700">
                    <div className="flex h-3 w-3 items-center justify-center font-bold">
                      B
                    </div>
                    bold
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-200 dark:hover:bg-stone-700">
                    <div className="flex h-3 w-3 items-center justify-center font-bold italic">
                      I
                    </div>
                    italic
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-200 dark:hover:bg-stone-700">
                    <ViewListIcon className="h-3 w-3 text-current" />
                    list
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Portal>
          </>
        )}
      </Menu> */}
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
    <div className="group relative z-0">
      <Element {...props} />
      <CommandMenu />
    </div>
  );
};
