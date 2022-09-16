import * as colors from "@radix-ui/colors";
import { styled, themeColors } from "#/stitches.config";
import { useStore } from "#/store";
export const ColorButton = styled("button", {
  border: "1px solid",
  borderRadius: "50%",
  width: 16,
  height: 16,
  cursor: "pointer",
});

export const ColorsSelector = () => {
  const { setColor } = useStore();

  return (
    <>
      {themeColors.map((color) => {
        return (
          <ColorButton
            key={color}
            onClick={() => setColor(color)}
            style={{
              backgroundColor: (colors as any)[color][color + "11"],
              borderColor: (colors as any)[color][color + "12"],
            }}
          />
        );
      })}
    </>
  );
};
