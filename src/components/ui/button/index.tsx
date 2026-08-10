import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-60 font-sans antialiased",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF4A1F] text-white shadow hover:bg-[#E03E15] active:scale-[0.99] cursor-pointer",
        primary:
          "bg-[#FF4A1F] text-white shadow hover:bg-[#E03E15] active:scale-[0.99] cursor-pointer",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 active:scale-[0.99] cursor-pointer",
        danger:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 active:scale-[0.99] cursor-pointer",
        outline:
          "border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] cursor-pointer",
        secondary:
          "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200 active:scale-[0.99] cursor-pointer",
        ghost: "hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] cursor-pointer",
        link: "text-[#FF4A1F] underline-offset-4 hover:underline cursor-pointer",
      },
      size: {
        default: "h-[42px] px-4 py-2 text-[14px]",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const BinanceEqualizer = () => (
  <div className="flex items-center justify-center gap-[4px] h-5 py-1">
    <span className="w-[3px] bg-white rounded-full animate-equalizer" style={{ animationDelay: '0ms' }} />
    <span className="w-[3px] bg-white rounded-full animate-equalizer" style={{ animationDelay: '150ms' }} />
    <span className="w-[3px] bg-white rounded-full animate-equalizer" style={{ animationDelay: '300ms' }} />
    <span className="w-[3px] bg-white rounded-full animate-equalizer" style={{ animationDelay: '450ms' }} />
  </div>
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, fullWidth, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), fullWidth && "w-full")}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <BinanceEqualizer />
        ) : (
          <>
            {icon && <span className="mr-2 inline-flex shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export default Button
