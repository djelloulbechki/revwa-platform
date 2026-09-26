import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-pop text-white shadow-[0_0_18px_-2px_hsl(var(--primary-glow)/0.5),0_6px_0_0_hsl(var(--primary-deep)/0.4)] hover:-translate-y-1 hover:shadow-[0_0_28px_-2px_hsl(var(--primary-glow)/0.65),0_8px_0_0_hsl(var(--primary-deep)/0.45)]",
        destructive:
          "rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "rounded-full border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground border-2 border-ink/10 hover:bg-muted",
        ghost: "rounded-full hover:bg-muted hover:text-foreground",
        link: "text-pop underline-offset-4 hover:underline decoration-2",
        sky: "rounded-full bg-sky text-white shadow-[0_0_14px_-2px_hsl(var(--sky)/0.4),0_6px_0_0_hsl(var(--ink)/0.25)] hover:-translate-y-1",
        mint: "rounded-full bg-mint text-white shadow-[0_0_14px_-2px_hsl(var(--mint)/0.35),0_6px_0_0_hsl(var(--ink)/0.25)] hover:-translate-y-1",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-9 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
