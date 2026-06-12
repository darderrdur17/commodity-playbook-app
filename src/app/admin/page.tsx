import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminClient } from "./admin-client";

export const metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <AdminClient
      adminName={session.user.name || "Admin"}
      adminId={session.user.id}
    />
  );
}
