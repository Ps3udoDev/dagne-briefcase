import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { requireAdminUser } from '@/lib/auth';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdminUser();

  return (
    <DashboardShell userEmail={user.email ?? 'dagneraza123@gmail.com'}>
      {children}
    </DashboardShell>
  );
}
