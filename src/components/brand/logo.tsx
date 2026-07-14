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

/** Brand Kit-2 assets — header_logo1, footer_logo1, login_page_logo1 */
const SOURCES: Record<Exclude<LogoVariant, "lockup-dark">, { src: string; width: number; height: number }> = {
  horizontal: { src: "/brand/header_logo1.png", width: 540, height: 152 },
  header: { src: "/brand/header_logo1.png", width: 540, height: 152 },
  footer: { src: "/brand/footer_logo1.png", width: 400, height: 96 },
  login: { src: "/brand/login_page_logo1.png", width: 280, height: 56 },
  mark: { src: "/brand/logo-mark.png", width: 40, height: 40 },
  white: { src: "/brand/header_logo1.png", width: 540, height: 152 },
  "wordmark-tagline": { src: "/brand/footer_logo1.png", width: 400, height: 96 },
};

/** Header fits within app nav — Brand Kit horizontal wordmark */
const HEADER_WRAPPER_CLASS =
  "inline-flex items-center h-[64px] sm:h-[72px] md:h-[80px] max-h-full max-w-[min(100%,320px)] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] shrink-0";

const VARIANT_IMAGE_CLASS: Record<Exclude<LogoVariant, "lockup-dark">, string> = {
  header: "h-full w-auto max-w-full object-contain object-left",
  footer:
    "h-[160px] w-auto sm:h-[180px] md:h-[200px] lg:h-[220px] max-w-[min(100%,400px)] object-contain object-left",
  login:
    "h-14 w-auto sm:h-16 md:h-[4.5rem] max-w-[min(100%,340px)] object-contain object-left",
  horizontal: "h-12 w-auto sm:h-14 max-w-[280px] object-contain object-left",
  mark: "h-9 w-9 sm:h-10 sm:w-10 object-contain",
  white: "h-14 w-auto sm:h-16 md:h-[4.5rem] max-w-[min(100%,340px)] object-contain object-left brightness-0 invert",
  "wordmark-tagline":
    "h-16 w-auto sm:h-[4.5rem] md:h-20 lg:h-[5.5rem] max-w-[min(100%,340px)] object-contain object-left",
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

/** Icon + wordmark — login / dark panels when PNG lockup is not used */
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
      <Image
        src="/brand/login_page_logo1.png"
        alt="CommodityPlaybook"
        width={280}
        height={56}
        priority={priority}
        className="h-12 w-auto sm:h-14 md:h-16 max-w-[min(100%,280px)] object-contain object-left"
      />
      {showTagline && (
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
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
  const image = (
    <Image
      src={src}
      alt="CommodityPlaybook"
      width={width}
      height={height}
      priority={priority}
      sizes={
        variant === "footer" || variant === "wordmark-tagline"
          ? "(max-width: 640px) 280px, 360px"
          : variant === "header"
            ? "(max-width: 640px) 320px, 520px"
            : "(max-width: 768px) 320px, 520px"
      }
      className={cn(VARIANT_IMAGE_CLASS[variant], imageClassName)}
    />
  );
  const img =
    variant === "header" ? (
      <span className={HEADER_WRAPPER_CLASS}>{image}</span>
    ) : (
      image
    );

  if (!href) {
    return <span className={cn("inline-flex items-center", className)}>{img}</span>;
  }

  return (
    <Link href={href} className={cn("inline-flex items-center shrink-0", className)} suppressHydrationWarning>
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
