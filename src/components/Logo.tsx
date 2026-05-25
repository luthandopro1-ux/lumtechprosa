import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Height in pixels (width auto-scales to the 3.5:1 logo aspect). */
  size?: number;
  /** Wrap in a Link to "/" when true (default). */
  asLink?: boolean;
  /** Hide the inline wordmark image and only show the icon mark. Not used yet — full lockup by default. */
  variant?: "full" | "compact";
}

/**
 * Lum Tech Pro SA brand lockup. Renders the official logo asset as an <img>.
 * The PNG already contains both the icon and "LUM TECH PRO SA" wordmark in
 * brand colors (teal→cyan gradient + white), designed for dark surfaces.
 * On light surfaces the white wordmark blends in, so prefer dark backgrounds
 * or use `variant="compact"` (icon only — todo).
 */
export function Logo({ className, size = 36, asLink = true }: LogoProps) {
  const img = (
    <img
      src={logoSrc}
      alt="Lum Tech Pro SA"
      style={{ height: size, width: "auto" }}
      className={cn("select-none object-contain", className)}
      draggable={false}
    />
  );
  if (!asLink) return img;
  return (
    <Link to="/" aria-label="Lum Tech Pro SA — home" className="inline-flex items-center">
      {img}
    </Link>
  );
}
