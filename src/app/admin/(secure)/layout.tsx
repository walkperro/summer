import { AdminShell } from "@/components/admin/AdminShell";
import { requireSummerAdminSession } from "@/lib/summer/admin-auth";

export default async function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSummerAdminSession();

  return <AdminShell adminEmail={session.adminUser.email}>{children}</AdminShell>;
}
