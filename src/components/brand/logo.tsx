import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "horizontal" | "mark" | "white" | "wordmark-tagline";

const SOURCES: Record<LogoVariant, { src: string; width: number; height: number }> = {
  horizontal: { src: "/brand/logo-horizontal.png", width: 220, height: 40 },
  mark: { src: "/brand/logo-mark.png", width: 40, height: 40 },
  white: { src: "/brand/logo-white.png", width: 220, height: 40 },
  "wordmark-tagline": { src: "/brand/logo-wordmark-tagline.png", width: 280, height: 72 },
};

interface LogoProps {
  variant?: LogoVariant;
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function Logo({
  variant = "horizontal",
  href = "/",
  className,
  imageClassName,
  priority = false,
}: LogoProps) {
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

/** Brand mark for search inputs and compact UI */
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
