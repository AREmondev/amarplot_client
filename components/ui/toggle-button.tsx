import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

const toggleButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "data-[state=on]:bg-primary/90 data-[state=on]:text-primary-foreground bg-muted text-muted-foreground hover:bg-muted/80",
        outline: "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        subtle: "data-[state=on]:bg-accent/80 data-[state=on]:text-accent-foreground bg-muted/40 text-muted-foreground hover:bg-muted/60",
        ghost: "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        primary: "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground bg-primary/20 text-primary hover:bg-primary/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
        sm: "rounded-sm",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleButtonVariants> {
  pressed?: boolean
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({
    className,
    variant,
    size,
    rounded,
    pressed,
    defaultPressed = false,
    onChange,
    leftIcon,
    rightIcon,
    fullWidth,
    children,
    ...props
  }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(defaultPressed)
    
    const isControlled = pressed !== undefined
    const isPressed = isControlled ? pressed : internalPressed

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isControlled) {
        setInternalPressed(!internalPressed)
      }
      
      onChange?.(!isPressed)
      props.onClick?.(event)
    }

    return (
      <button
        className={cn(toggleButtonVariants({ variant, size, rounded, fullWidth, className }))}
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        data-state={isPressed ? "on" : "off"}
        onClick={handleClick}
        {...props}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    )
  }
)
ToggleButton.displayName = "ToggleButton"

export { ToggleButton, toggleButtonVariants }