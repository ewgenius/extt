import { createStitches } from "@stitches/react";
import { mauve, mauveDark } from "@radix-ui/colors";

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
      background: "$primary1",
      text: "$primary11",
    },
  },
});

export const darkTheme = createTheme({
  colors: {
    primary1: mauveDark.mauve1,
    primary2: mauveDark.mauve2,
    primary3: mauveDark.mauve3,
    primary4: mauveDark.mauve4,
    primary5: mauveDark.mauve5,
    primary6: mauveDark.mauve6,
    primary7: mauveDark.mauve7,
    primary8: mauveDark.mauve8,
    primary9: mauveDark.mauve9,
    primary10: mauveDark.mauve10,
    primary11: mauveDark.mauve11,
    primary12: mauveDark.mauve12,
  },
});

export const lightTheme = createTheme({
  colors: {
    primary1: mauve.mauve1,
    primary2: mauve.mauve2,
    primary3: mauve.mauve3,
    primary4: mauve.mauve4,
    primary5: mauve.mauve5,
    primary6: mauve.mauve6,
    primary7: mauve.mauve7,
    primary8: mauve.mauve8,
    primary9: mauve.mauve9,
    primary10: mauve.mauve10,
    primary11: mauve.mauve11,
    primary12: mauve.mauve12,
  },
});

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
    backgroundColor: "$background",
    color: "$text",
    transition: "color 0.3s, background-color 0.15s",
  },
});
