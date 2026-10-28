import type { Metadata } from 'next';
import { WorkspaceShell } from '@/components/portugal/workspace-shell';
export const metadata: Metadata = { title: 'DealReady demo workspace', robots: { index: false, follow: false } };
export default function WorkspaceLayout({children}:{children:React.ReactNode}) { return <WorkspaceShell>{children}</WorkspaceShell>; }
