import * as React from "react"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  external?: boolean
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({
    className,
    variant,
    size,
    rounded,
    href,
    leftIcon,
    rightIcon,
    fullWidth,
    children,
    external = false,
    ...props
  }, ref) => {
    const linkProps = external ? {
      target: "_blank",
      rel: "noopener noreferrer",
      ...props
    } : props

    const content = (
      <>
        {leftIcon}
        {children}
        {rightIcon}
      </>
    )

    if (external) {
      return (
        <a
          className={cn(buttonVariants({ variant, size, fullWidth, rounded, className }))}
          href={href}
          ref={ref}
          {...linkProps}
        >
          {content}
        </a>
      )
    }

    return (
      <Link
        className={cn(buttonVariants({ variant, size, fullWidth, rounded, className }))}
        href={href}
        ref={ref as any} // Type casting needed due to Next.js Link component types
        {...linkProps}
      >
        {content}
      </Link>
    )
  }
)
LinkButton.displayName = "LinkButton"

export { LinkButton }