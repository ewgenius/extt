import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex-inline items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-base-6/50 focus-visible:ring-[2px]",
  {
    variants: {
      variant: {
        default:
          "border border-base-7 bg-base-3 hover:bg-base-4 hover:border-base-8 active:bg-base-5",
        outline:
          "border border-base-7 bg-transparent hover:bg-base-4 hover:border-base-8 active:bg-base-5",
      },
      size: {
        xs: "px-1 py-0.5 rounded-xs text-xs",
        sm: "px-2 py-1 rounded-sm text-sm",
        md: "px-3 py-1.5 rounded-md text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  );
}
