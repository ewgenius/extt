import type { ComponentType } from "react";
import { styled } from "#/stitches.config";
import {
  SunIcon as SunIconUnstyled,
  MoonIcon as MoonIconUnstyled,
  FolderOpenIcon as FolderOpenIconUnstyled,
  DocumentPlusIcon as DocumentPlusIconUnstyled,
} from "@heroicons/react/24/outline";

function styledIcon(icon: ComponentType<any>) {
  return styled(icon, {
    variants: {
      size: {
        s: {
          width: 16,
          height: 16,
        },
        m: {
          width: 20,
          height: 20,
        },
        l: {
          width: 24,
          height: 24,
        },
      },
    },

    defaultVariants: {
      size: "s",
    },
  });
}

export const SunIcon = styledIcon(SunIconUnstyled);
export const MoonIcon = styledIcon(MoonIconUnstyled);
export const FolderOpenIcon = styledIcon(FolderOpenIconUnstyled);
export const DocumentPlusIcon = styledIcon(DocumentPlusIconUnstyled);
