import { MAIN_MIN_HEIGHT_BELOW_NAV } from "@/lib/layout-constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: MAIN_MIN_HEIGHT_BELOW_NAV }}>
      {children}
    </div>
  );
}
