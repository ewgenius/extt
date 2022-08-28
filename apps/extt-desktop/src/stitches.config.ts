import { createStitches } from "@stitches/react";
import * as colors from "@radix-ui/colors";
import { mauve, mauveDark } from "@radix-ui/colors";

function getPrimarySwatch(
  key: string,
  swatch: Record<string, string>
): Record<string, string> {
  return {
    primary1: swatch[`${key}1`],
    primary2: swatch[`${key}2`],
    primary3: swatch[`${key}3`],
    primary4: swatch[`${key}4`],
    primary5: swatch[`${key}5`],
    primary6: swatch[`${key}6`],
    primary7: swatch[`${key}7`],
    primary8: swatch[`${key}8`],
    primary9: swatch[`${key}9`],
    primary10: swatch[`${key}10`],
    primary11: swatch[`${key}11`],
    primary12: swatch[`${key}12`],
  };
}

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      bg1: "$primary1",
      bg2: "$primary2",

      bgNormal: "$primary3",
      bgHover: "$primary4",
      bgActive: "$primary5",

      borderDefault: "$primary6",
      borderActive: "$primary7",
      borderHover: "$primary8",

      solid1: "$primary9",
      solid2: "$primary10",

      text1: "$primary11",
      text2: "$primary12",
    },
    space: {
      1: "2px",
      2: "4px",
      3: "8px",
      4: "16px",
    },
    radii: {
      1: "2px",
      2: "4px",
      3: "8px",
      4: "16px",
    },
  },
});

export const darkTheme = createTheme({
  colors: {
    ...getPrimarySwatch("mauve", mauveDark),
  },
});

export const lightTheme = createTheme({
  colors: {
    ...getPrimarySwatch("mauve", mauve),
  },
});

export const themeColors = Object.keys(colors).filter(
  (c) => !c.endsWith("A") && !c.endsWith("Dark")
);

export const themes = themeColors.reduce<Record<string, any>>((acc, key) => {
  return {
    ...acc,
    [key]: createTheme({
      colors: {
        ...getPrimarySwatch(key, (colors as any)[key]),
      },
    }),
    [key + "Dark"]: createTheme({
      colors: {
        ...getPrimarySwatch(key, (colors as any)[key + "Dark"]),
      },
    }),
  };
}, {});

export const globalStyles = globalCss({
  "*": { margin: 0, padding: 0 },
  "@font-face": [
    {
      fontFamily: "IBM Plex Mono",
      fontStyle: "normal",
      fontWeight: 400,
      src: `url("/fonts/IBMPlexMono-Regular.woff2") format("woff2")`,
    },
  ],
  body: {
    fontFamily: "IBM Plex Mono",
    backgroundColor: "$bg1",
    color: "$text1",
    transition: "color 0.3s, background-color 0.15s",
    overflow: "hidden",
  },
  "input::placeholder": {
    color: "inherit",
    opacity: 0.5,
  },
});
