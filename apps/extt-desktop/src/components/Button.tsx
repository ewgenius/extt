import { styled } from "#/stitches.config";

export const Button = styled("button", {
  display: "flex",
  gap: "$3",
  alignItems: "center",
  paddingTop: "$2",
  paddingBottom: "$2",
  paddingLeft: "$3",
  paddingRight: "$3",
  border: "none",
  borderRadius: "$2",
  backgroundColor: "$bgNormal",
  color: "$text1",
  fontFamily: "inherit",

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
