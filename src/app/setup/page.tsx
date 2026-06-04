"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/Card";
import { ProfileForm } from "@/components/ProfileForm";
import { getOrCreateDailyQuiz } from "@/lib/quiz";
import { getProfile, saveProfile, subscribeToStorage } from "@/lib/storage";
import type { Profile } from "@/types/quiz";

export default function SetupPage() {
  const router = useRouter();
  const profile = useSyncExternalStore(subscribeToStorage, getProfile, () => null);

  function handleSubmit(nextProfile: Profile) {
    saveProfile(nextProfile);
    getOrCreateDailyQuiz(nextProfile);
    router.push("/quiz");
  }

  return (
    <AppShell eyebrow="Setup">
      <div className="grid flex-1 gap-8 py-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:py-12">
        <section className="max-w-xl">
          <p className="text-sm font-semibold text-emerald-300">
            Developer profile
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-50 sm:text-5xl">
            Tune today&apos;s warm-up to your work.
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            Pick the role, stack, level, and goal you want StillDev to use for
            the daily check.
          </p>
          {profile ? (
            <p className="mt-4 rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm leading-6 text-zinc-400">
              Saved profile found: {profile.stack}, {profile.level}. Adjust any
              part of it, or continue with the same setup.
            </p>
          ) : null}
        </section>

        <Card>
          <ProfileForm
            initialProfile={profile}
            key={profile ? `${profile.role}-${profile.stack}-${profile.level}-${profile.goal}` : "new-profile"}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </AppShell>
  );
}
