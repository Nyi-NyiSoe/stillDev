"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { getDailyResult } from "@/lib/storage";

export default function Home() {
  const router = useRouter();

  function startTodayCheck() {
    const result = getDailyResult();

    if (result) {
      router.push("/result");
      return;
    }

    router.push("/setup");
  }

  return (
    <AppShell>
      <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-16">
        <section className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase text-emerald-300">
            StillDev
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-zinc-50 sm:text-6xl">
            Are you still sharp as a developer?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            Take a 10-question daily check based on your stack and experience.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="sm:min-w-44" onClick={startTodayCheck}>
              Start Today&apos;s Check
            </Button>
            <ButtonLink className="sm:min-w-36" href="/history" variant="secondary">
              View History
            </ButtonLink>
          </div>
        </section>

        <Card className="lg:justify-self-end">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-zinc-50">Daily check</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                10 focused questions matched to your profile.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 border-y border-zinc-800 py-4 text-center">
              <Metric label="Questions" value="10" />
              <Metric label="Time" value="5m" />
              <Metric label="Streak" value="Local" />
            </div>
            <p className="text-sm leading-6 text-zinc-400">
              Same profile and same date means the same quiz, even after refresh.
            </p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-lg font-semibold text-zinc-50">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase text-zinc-500">{label}</p>
    </div>
  );
}
