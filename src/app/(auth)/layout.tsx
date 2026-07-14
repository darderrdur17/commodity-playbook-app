import { MAIN_MIN_HEIGHT_BELOW_NAV } from "@/lib/layout-constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mb-[max(1rem,env(safe-area-inset-bottom))]" style={{ minHeight: MAIN_MIN_HEIGHT_BELOW_NAV }}>
      {children}
    </div>
  );
}
