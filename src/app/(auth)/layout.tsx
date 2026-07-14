export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100svh-80px-env(safe-area-inset-top,0px))] -mb-[max(1rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}
