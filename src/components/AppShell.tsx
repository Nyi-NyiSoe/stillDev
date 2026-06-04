import Link from "next/link";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  eyebrow?: string;
};

export function AppShell({ children, eyebrow }: AppShellProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-4 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 py-4">
          <Link href="/" className="text-lg font-bold text-zinc-950">
            StillDev
          </Link>
          {eyebrow ? (
            <span className="text-sm font-medium text-zinc-500">{eyebrow}</span>
          ) : null}
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </main>
  );
}
