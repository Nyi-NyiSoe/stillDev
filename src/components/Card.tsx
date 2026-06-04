import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-sm shadow-black/30 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}
