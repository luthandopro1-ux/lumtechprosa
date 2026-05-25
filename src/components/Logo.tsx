import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Height in pixels (width auto-scales). */
  size?: number;
  /** Wrap in a Link to "/" when true (default). */
  asLink?: boolean;
  /** Show the brand tagline beneath the lockup. */
  tagline?: boolean | string;
  /** Premium glow/drop-shadow treatment for dark hero surfaces. */
  glow?: boolean;
  /** Disable hover animation (e.g. in footers or static contexts). */
  static?: boolean;
}

const DEFAULT_TAGLINE = "Building Intelligent Digital Infrastructure";

/**
 * Lum Tech Pro SA enterprise brand lockup.
 * Renders the official artwork with crisp scaling, optional glow, and an
 * optional tagline — designed for premium dark surfaces.
 */
export function Logo({
  className,
  size = 48,
  asLink = true,
  tagline = false,
  glow = false,
  static: isStatic = false,
}: LogoProps) {
  const taglineText = typeof tagline === "string" ? tagline : DEFAULT_TAGLINE;
  const showTagline = Boolean(tagline);

  const img = (
    <img
      src={logoSrc}
      alt="Lum Tech Pro SA — Building Intelligent Digital Infrastructure"
      style={{
        height: size,
        width: "auto",
        // Crisp downscale on retina + high-quality interpolation
        imageRendering: "auto",
      }}
      className={cn(
        "select-none object-contain transition-[filter,transform] duration-300 ease-out",
        glow
          ? "drop-shadow-[0_0_18px_rgba(45,212,191,0.35)]"
          : "drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
        !isStatic && "group-hover/logo:scale-[1.02] group-hover/logo:drop-shadow-[0_0_22px_rgba(45,212,191,0.45)]",
      )}
      draggable={false}
      decoding="async"
    />
  );

  const inner = showTagline ? (
    <span className="flex flex-col items-start gap-1.5">
      {img}
      <span
        className="font-display text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
        style={{ paddingLeft: 2 }}
      >
        {taglineText}
      </span>
    </span>
  ) : (
    img
  );

  const wrapperClass = cn(
    "group/logo inline-flex items-center",
    !isStatic && "cursor-pointer",
    className,
  );

  if (!asLink) {
    return <span className={wrapperClass}>{inner}</span>;
  }
  return (
    <Link to="/" aria-label="Lum Tech Pro SA — home" className={wrapperClass}>
      {inner}
    </Link>
  );
}
