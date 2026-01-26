import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
        subtle: "bg-muted/50 text-muted-foreground hover:bg-muted",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80",
        "outline-primary": "border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        "outline-destructive": "border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-xs": "h-6 w-6",
      },
      fullWidth: {
        true: "w-full",
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    rounded,
    asChild = false,
    isLoading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth,
    children,
    disabled,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || isLoading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, rounded, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" />
            {loadingText || children}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            {leftIcon}
            {children}
            {rightIcon}
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
