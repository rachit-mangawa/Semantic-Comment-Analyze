import React from "react";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "outline-light"
  | "outline-dark"
  | "aloe"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      children,
      icon,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base micro-interaction & accessibility styles per DESIGN.md & Emil Kowalski
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium rounded-pill tracking-normal transition-all duration-150 ease-out select-none active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

    // Strict DESIGN.md Button Vocabulary
    const variants: Record<ButtonVariant, string> = {
      // button-primary-pill: Black background, on-primary text, hover lifts to shade-70
      primary:
        "bg-primary text-on-primary hover:bg-shade-70 focus-visible:outline-primary shadow-sm",
      // button-outline-on-light: Canvas-light bg, 1px ink border
      "outline-light":
        "bg-canvas-light text-ink border border-ink/80 hover:bg-black/[0.04] focus-visible:outline-ink",
      outline:
        "bg-canvas-light text-ink border border-ink/80 hover:bg-black/[0.04] focus-visible:outline-ink",
      // button-outline-on-dark: Cinematic hero CTA, 2px solid on-primary border, transparent/black bg
      "outline-dark":
        "bg-canvas-night text-on-primary border-2 border-on-primary hover:bg-white/10 focus-visible:outline-white",
      // button-aloe-pill: Transactional featured CTA, aloe-10 background, ink text
      aloe:
        "bg-aloe-10 text-ink hover:bg-[#aef5c5] font-semibold focus-visible:outline-aloe-10 shadow-sm",
      // ghost pill
      ghost:
        "bg-transparent text-ink hover:bg-shade-30/30 focus-visible:outline-ink",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "h-9 px-4 text-[13px] gap-1.5",
      md: "h-11 px-6 text-[15px] gap-2", // 12px 24px standard
      lg: "h-13 px-8 text-[16px] gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
