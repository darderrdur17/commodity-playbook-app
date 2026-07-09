interface MembersStripProps {
  label: string;
  companies: string[];
  variant?: "light" | "dark";
}

export function MembersStrip({ label, companies, variant = "light" }: MembersStripProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={
        isDark
          ? "py-8 sm:py-9 bg-[#f1f4f8] border-t border-[#e2e6ec]"
          : "py-8 sm:py-9 bg-[#f5f0e8] border-y border-[#e8e0d4]"
      }
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 sm:mb-5 text-muted-fg">
          {label}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10 sm:gap-y-4 opacity-70">
          {companies.map((name) => (
            <span key={name} className="font-serif font-bold text-base sm:text-lg text-gray-900">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
