import { styled } from "#/stitches.config";

export const Button = styled("button", {
  border: "none",
  padding: "$3",
  borderRadius: "$2",
  backgroundColor: "$bgNormal",
  color: "$text1",

  "&:not([disabled])": {
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "$bgHover",
    },

    "&:active": {
      backgroundColor: "$bgActive",
    },
  },

  "&[disabled]": {
    color: "$solid1",
  },
});
