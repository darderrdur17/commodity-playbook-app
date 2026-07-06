import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant =
  | "horizontal"
  | "header"
  | "footer"
  | "login"
  | "mark"
  | "white"
  | "wordmark-tagline"
  | "lockup-dark";

const SOURCES: Record<Exclude<LogoVariant, "lockup-dark">, { src: string; width: number; height: number }> = {
  horizontal: { src: "/brand/logo-horizontal.png", width: 220, height: 40 },
  header: { src: "/brand/header_logo1.png", width: 220, height: 44 },
  footer: { src: "/brand/footer_logo1.png", width: 340, height: 80 },
  login: { src: "/brand/login_page_logo1.png", width: 220, height: 44 },
  mark: { src: "/brand/logo-mark.png", width: 40, height: 40 },
  white: { src: "/brand/logo-white.png", width: 220, height: 40 },
  "wordmark-tagline": { src: "/brand/logo-wordmark-tagline.png", width: 280, height: 72 },
};

interface LogoProps {
  variant?: LogoVariant;
  href?: string | false;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** Show tagline under the lockup (dark backgrounds only) */
  showTagline?: boolean;
}

/** Icon + wordmark — matches nav on light, inverted on dark (no white PNG box) */
function LogoLockupDark({
  className,
  showTagline = false,
  priority = false,
}: {
  className?: string;
  showTagline?: boolean;
  priority?: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-col gap-2.5", className)}>
      <span className="inline-flex items-center gap-2.5">
        <Image
          src="/brand/logo-mark.png"
          alt=""
          width={36}
          height={36}
          priority={priority}
          className="h-8 w-8 sm:h-9 sm:w-9 object-contain shrink-0"
          aria-hidden
        />
        <span className="font-sans font-bold text-[17px] sm:text-[18px] tracking-tight leading-none">
          <span className="text-white">Commodity</span>
          <span className="bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
            Playbook
          </span>
        </span>
      </span>
      {showTagline && (
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">
          Break in. Move up. Stay sharp.
        </span>
      )}
    </span>
  );
}

export function Logo({
  variant = "horizontal",
  href = "/",
  className,
  imageClassName,
  priority = false,
  showTagline = false,
}: LogoProps) {
  if (variant === "lockup-dark") {
    const lockup = (
      <LogoLockupDark className={className} showTagline={showTagline} priority={priority} />
    );
    if (!href) return lockup;
    return (
      <Link href={href} className="inline-flex shrink-0">
        {lockup}
      </Link>
    );
  }

  const { src, width, height } = SOURCES[variant];
  const img = (
    <Image
      src={src}
      alt="CommodityPlaybook"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto max-h-10 object-contain object-left", imageClassName)}
    />
  );

  if (!href) {
    return <span className={cn("inline-flex items-center", className)}>{img}</span>;
  }

  return (
    <Link href={href} className={cn("inline-flex items-center shrink-0", className)}>
      {img}
    </Link>
  );
}
export function BrandSearchPrefix({
  className,
  size = 22,
  dark = false,
}: {
  className?: string;
  size?: number;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center flex-shrink-0",
        dark ? "pl-3 pr-2" : "pl-3 pr-2 border-r border-border",
        className
      )}
    >
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
        aria-hidden
      />
    </div>
  );
}

interface BrandedSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "light" | "dark";
  wrapperClassName?: string;
}

export function BrandedSearchInput({
  variant = "light",
  wrapperClassName,
  className,
  ...props
}: BrandedSearchInputProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "flex items-stretch overflow-hidden rounded-lg border",
        isDark ? "border-white/25 bg-white/10 max-w-lg" : "border-border bg-white",
        wrapperClassName
      )}
    >
      <BrandSearchPrefix dark={isDark} />
      <input
        {...props}
        className={cn(
          "flex-1 min-w-0 bg-transparent text-sm focus:outline-none focus:ring-0",
          isDark
            ? "py-3 pr-4 text-white placeholder:text-white/40"
            : "h-10 py-2 pr-4 text-gray-900 placeholder:text-muted-fg",
          className
        )}
      />
    </div>
  );
}
