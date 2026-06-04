"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import {
  getDailyQuiz,
  getDailyResult,
  getProfile,
  subscribeToStorage,
} from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const profile = useSyncExternalStore(subscribeToStorage, getProfile, () => null);
  const quiz = useSyncExternalStore(subscribeToStorage, getDailyQuiz, () => null);
  const result = useSyncExternalStore(subscribeToStorage, getDailyResult, () => null);

  function startTodayCheck() {
    if (result) {
      router.push("/result");
      return;
    }

    if (profile && quiz) {
      router.push("/quiz");
      return;
    }

    router.push(profile ? "/quiz" : "/setup");
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-10 py-10 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <section className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold text-emerald-300">
              Daily developer warm-up
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-zinc-50 sm:text-6xl">
              Five calm minutes to check what still feels solid.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
              StillDev gives you 10 practical questions matched to your role,
              stack, and experience, then points out the areas worth revisiting.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="sm:min-w-44" onClick={startTodayCheck}>
                {result
                  ? "Review Today's Result"
                  : profile
                    ? "Continue Warm-up"
                    : "Start Today's Check"}
              </Button>
              <ButtonLink className="sm:min-w-36" href="/history" variant="secondary">
                View History
              </ButtonLink>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
              No account or backend. Your profile, quiz, result, and history stay
              in this browser.
            </p>
            {profile ? (
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                Saved profile: {profile.stack}, {profile.level}. You can keep the
                same warm-up rhythm or adjust it from setup later.
              </p>
            ) : null}
          </section>

          <Card className="lg:justify-self-end">
            {result ? (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-zinc-50">
                    Today&apos;s check is complete
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    Your result is saved in this browser for {result.date}.
                  </p>
                </div>
                <div className="rounded-md border border-zinc-800 bg-zinc-900/60 p-4">
                  <p className="text-sm font-medium text-zinc-400">Score</p>
                  <p className="mt-1 text-3xl font-semibold text-zinc-50">
                    {result.score} / {result.total}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-emerald-300">
                    {result.rank}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {result.weakAreas.length > 0
                      ? `Focus area: ${result.weakAreas[0]}`
                      : "No missed areas today."}
                  </p>
                </div>
                <ButtonLink href="/result" className="w-full" variant="secondary">
                  Review Today&apos;s Notes
                </ButtonLink>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-zinc-50">
                    Today&apos;s warm-up preview
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    A practical check with room to think.
                  </p>
                </div>

                <div className="rounded-md border border-zinc-800 bg-zinc-900/60 p-4">
                  <p className="text-xs font-semibold text-emerald-300">
                    React / Junior / Stay sharp
                  </p>
                  <h2 className="mt-3 text-base font-semibold leading-6 text-zinc-50">
                    A component re-renders more often than expected. What should
                    you inspect first?
                  </h2>
                  <div className="mt-4 space-y-2 text-sm text-zinc-300">
                    <PreviewOption>Props that change identity each render</PreviewOption>
                    <PreviewOption>Whether CSS modules are enabled</PreviewOption>
                    <PreviewOption>The component&apos;s file name</PreviewOption>
                  </div>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-md bg-zinc-900 p-3">
                    <p className="font-semibold text-zinc-50">5-minute target</p>
                    <p className="mt-1 leading-6 text-zinc-400">
                      Short enough to fit before real work.
                    </p>
                  </div>
                  <div className="rounded-md bg-zinc-900 p-3">
                    <p className="font-semibold text-zinc-50">Same day, same quiz</p>
                    <p className="mt-1 leading-6 text-zinc-400">
                      Refreshing will not reshuffle today&apos;s questions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <section className="border-t border-zinc-800 pt-8">
          <div className="grid gap-4 md:grid-cols-3">
            <HowItWorksStep
              label="1"
              title="Set your profile"
              text="Choose your role, stack, experience level, and goal once."
            />
            <HowItWorksStep
              label="2"
              title="Take today&apos;s check"
              text="Answer 10 practical questions generated from your profile and today&apos;s date."
            />
            <HowItWorksStep
              label="3"
              title="Review weak areas"
              text="See your score, explanations, and the topics that need a little more reps."
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function PreviewOption({ children }: { children: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2">
      {children}
    </div>
  );
}

function HowItWorksStep({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-start gap-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-400 text-sm font-bold text-zinc-950">
          {label}
        </span>
        <div>
          <h2 className="text-base font-semibold text-zinc-50">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
        </div>
      </div>
    </div>
  );
}
