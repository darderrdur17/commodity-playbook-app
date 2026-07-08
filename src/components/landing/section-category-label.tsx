import { cn } from "@/lib/utils";

interface SectionCategoryLabelProps {
  children: React.ReactNode;
  className?: string;
  colorClass?: string;
}

/** Centered `— LABEL —` style used across both landing tracks */
export function SectionCategoryLabel({
  children,
  className,
  colorClass = "text-primary-800",
}: SectionCategoryLabelProps) {
  return (
    <p
      className={cn(
        "flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] mb-4",
        colorClass,
        className
      )}
    >
      <span className="h-px w-8 sm:w-12 bg-current opacity-25" aria-hidden />
      <span>{children}</span>
      <span className="h-px w-8 sm:w-12 bg-current opacity-25" aria-hidden />
    </p>
  );
}
