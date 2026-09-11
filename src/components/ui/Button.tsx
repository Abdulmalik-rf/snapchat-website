import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 select-none disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-snap text-ink shadow-glow hover:bg-snap-600 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "glass text-fog hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-fog/80 hover:text-fog hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type LinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const cls = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _c; void _ch;
    const external = /^https?:\/\//.test(href);
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
  void _v; void _s; void _c; void _ch;
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
