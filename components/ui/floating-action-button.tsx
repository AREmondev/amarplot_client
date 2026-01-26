import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const fabVariants = cva(
  "fixed inline-flex items-center justify-center rounded-full shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        default: "h-14 w-14",
        sm: "h-12 w-12",
        lg: "h-16 w-16",
        xl: "h-20 w-20",
      },
      position: {
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
      },
      extended: {
        true: "px-6",
      },
      elevation: {
        default: "shadow-md hover:shadow-lg",
        low: "shadow-sm hover:shadow",
        high: "shadow-xl hover:shadow-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right",
      elevation: "default",
    },
    compoundVariants: [
      {
        extended: true,
        size: "default",
        className: "w-auto min-w-14",
      },
      {
        extended: true,
        size: "sm",
        className: "w-auto min-w-12",
      },
      {
        extended: true,
        size: "lg",
        className: "w-auto min-w-16",
      },
      {
        extended: true,
        size: "xl",
        className: "w-auto min-w-20",
      },
    ],
  }
)

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  icon: React.ReactNode
  label?: string
  isLoading?: boolean
  extended?: boolean
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({
    className,
    variant,
    size,
    position,
    elevation,
    icon,
    label,
    isLoading = false,
    extended = false,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        className={cn(fabVariants({ variant, size, position, elevation, extended, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-label={label || "Action button"}
        type="button"
        {...props}
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <>
            {icon}
            {extended && label && (
              <span className="ml-2 text-sm font-medium">{label}</span>
            )}
          </>
        )}
      </button>
    )
  }
)
FloatingActionButton.displayName = "FloatingActionButton"

export { FloatingActionButton, fabVariants }