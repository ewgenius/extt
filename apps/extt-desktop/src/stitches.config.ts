import { createStitches } from "@stitches/react";

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
      background: "white",
      text: "black",
    },
  },
});

export const darkTheme = createTheme({
  colors: {
    background: "black",
    text: "white",
  },
});

export const lightTheme = createTheme({
  colors: {
    background: "white",
    text: "black",
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
    overflow: "hidden",
    backgroundColor: "$background",
    color: "$text",
  },
});
