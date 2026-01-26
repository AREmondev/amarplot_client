import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps, buttonVariants } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu"

export interface SplitButtonProps extends Omit<ButtonProps, "asChild"> {
  menuItems: React.ReactNode
  menuTriggerAriaLabel?: string
}

const SplitButton = React.forwardRef<HTMLButtonElement, SplitButtonProps>(
  ({
    className,
    variant = "default",
    size = "default",
    rounded = "default",
    menuItems,
    menuTriggerAriaLabel = "Open menu",
    isLoading,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth,
    children,
    disabled,
    ...props
  }, ref) => {
    // Determine the correct border radius for the main button
    const mainButtonRounded = {
      default: "rounded-r-none",
      full: "rounded-r-none",
      none: "",
      sm: "rounded-r-none",
      lg: "rounded-r-none",
      xl: "rounded-r-none",
    }[rounded as string] || "rounded-r-none"

    // Determine the correct border radius for the dropdown trigger
    const triggerRounded = {
      default: "rounded-l-none border-l",
      full: "rounded-l-none border-l",
      none: "border-l",
      sm: "rounded-l-none border-l",
      lg: "rounded-l-none border-l",
      xl: "rounded-l-none border-l",
    }[rounded as string] || "rounded-l-none border-l"

    return (
      <div className={cn("inline-flex", fullWidth && "w-full", className)}>
        <Button
          variant={variant}
          size={size}
          className={cn(mainButtonRounded, fullWidth && "flex-1")}
          isLoading={isLoading}
          loadingText={loadingText}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          disabled={disabled}
          ref={ref}
          {...props}
        >
          {children}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant, size }),
              triggerRounded,
              "px-2",
              isLoading && "opacity-50 pointer-events-none"
            )}
            disabled={disabled}
            aria-label={menuTriggerAriaLabel}
          >
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {menuItems}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
)
SplitButton.displayName = "SplitButton"

export { SplitButton }