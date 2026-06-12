export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen -mt-16">
      {children}
    </div>
  );
}
