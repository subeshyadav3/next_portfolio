import type { ReactNode } from "react";
import { auth } from "@/lib/auth/config";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <AdminNav
      userName={session.user.name ?? session.user.email ?? ""}
    >
      {children}
    </AdminNav>
  );
}
