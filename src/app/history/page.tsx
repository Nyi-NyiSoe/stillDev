"use client";

import { useSyncExternalStore } from "react";
import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { getHistory, subscribeToStorage } from "@/lib/storage";

export default function HistoryPage() {
  const history = useSyncExternalStore(subscribeToStorage, getHistory, () => []);

  return (
    <AppShell eyebrow="History">
      <div className="mx-auto w-full max-w-4xl space-y-6 py-8">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-50">History</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Past warm-up results saved in this browser.
          </p>
        </div>

        <Card>
          {history.length === 0 ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-50">
                  No warm-ups saved yet
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Finish today&apos;s check and StillDev will keep the result here
                  in this browser.
                </p>
              </div>
              <ButtonLink href="/">Take Today&apos;s Check</ButtonLink>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[38rem] text-left text-sm">
                <thead className="text-zinc-400">
                  <tr className="border-b border-zinc-800">
                    <th className="py-3 font-semibold">Date</th>
                    <th className="py-3 font-semibold">Stack</th>
                    <th className="py-3 font-semibold">Level</th>
                    <th className="py-3 font-semibold">Score</th>
                    <th className="py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr className="border-b border-zinc-900 last:border-0" key={item.date}>
                      <td className="py-3 text-zinc-50">{item.date}</td>
                      <td className="py-3 text-zinc-300">{item.stack}</td>
                      <td className="py-3 text-zinc-300">{item.level}</td>
                      <td className="py-3 text-zinc-300">
                        {item.score} / {item.total}
                      </td>
                      <td className="py-3 font-semibold text-zinc-50">{item.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <ButtonLink href="/" variant="secondary">
          Back Home
        </ButtonLink>
      </div>
    </AppShell>
  );
}
