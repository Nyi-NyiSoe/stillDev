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
          <p className="text-sm font-semibold uppercase text-zinc-600">
            Developer profile
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            Tune today&apos;s quiz to your work.
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-700">
            Pick the role, stack, level, and goal you want StillDev to use for
            the daily check.
          </p>
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
