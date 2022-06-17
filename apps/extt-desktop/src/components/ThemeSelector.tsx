import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Theme, useApp } from "#/store/app";

const themes: Theme[] = ["system", "dark", "light"];

export const ThemeSelector = () => {
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);

  return (
    <Listbox value={theme} onChange={setTheme}>
      <Listbox.Button>{theme}</Listbox.Button>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-stone-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {themes.map((value) => (
            <Listbox.Option key={value} value={value}>
              {value}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
};
