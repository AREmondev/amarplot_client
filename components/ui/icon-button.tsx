import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
        subtle: "bg-muted/50 text-muted-foreground hover:bg-muted",
      },
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        xs: "h-6 w-6",
        lg: "h-12 w-12",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
        sm: "rounded-sm",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode
  isLoading?: boolean
  "aria-label": string // Make aria-label required for accessibility
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    icon, 
    isLoading = false, 
    disabled,
    "aria-label": ariaLabel,
    ...props 
  }, ref) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        className={cn(iconButtonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-label={ariaLabel}
        type="button"
        {...props}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          icon
        )}
      </button>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }