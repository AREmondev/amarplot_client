import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./button"

const buttonGroupVariants = cva(
  "inline-flex items-center",
  {
    variants: {
      variant: {
        default: "rounded-md overflow-hidden",
        attached: "[&>*:not(:first-child)]:border-l-0 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
        segmented: "p-1 bg-muted rounded-md gap-1",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col [&>*:not(:first-child)]:border-t-0 [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
      },
      fullWidth: {
        true: "w-full [&>*]:flex-1",
      },
    },
    defaultVariants: {
      variant: "attached",
      orientation: "horizontal",
    },
  }
)

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  children: React.ReactNode
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, variant, orientation, fullWidth, children, ...props }, ref) => {
    // Filter and clone children to ensure they're all Button components
    const buttonChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === Button) {
        // For segmented variant, ensure buttons use the correct styling
        if (variant === "segmented") {
          return React.cloneElement(child, {
            variant: child.props.variant || "ghost",
            className: cn(child.props.className),
          })
        }
        return child
      }
      console.warn("ButtonGroup children should be Button components")
      return child
    })

    return (
      <div
        className={cn(buttonGroupVariants({ variant, orientation, fullWidth, className }))}
        ref={ref}
        role="group"
        {...props}
      >
        {buttonChildren}
      </div>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup, buttonGroupVariants }