"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import type { ExperienceLevel, Goal, Profile, Role, Stack } from "@/types/quiz";

const roles: Role[] = [
  "Frontend Developer",
  "Mobile Developer",
  "Full-stack Developer",
  "Student / Beginner",
];

const stacks: Stack[] = ["React", "JavaScript", "Flutter"];

const levels: ExperienceLevel[] = ["Beginner", "Junior", "Mid-level", "Senior"];

const goals: Goal[] = [
  "Interview prep",
  "Stay sharp",
  "Find weak areas",
  "Daily challenge",
];

type ProfileFormProps = {
  initialProfile?: Profile | null;
  onSubmit: (profile: Profile) => void;
};

export function ProfileForm({ initialProfile, onSubmit }: ProfileFormProps) {
  const [profile, setProfile] = useState<Profile>(
    initialProfile ?? {
      role: "Frontend Developer",
      stack: "React",
      level: "Junior",
      goal: "Stay sharp",
    },
  );

  function updateProfile<Key extends keyof Profile>(key: Key, value: Profile[Key]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(profile);
      }}
    >
      <Fieldset
        label="Role"
        options={roles}
        value={profile.role}
        onChange={(value) => updateProfile("role", value as Role)}
      />
      <Fieldset
        label="Stack"
        options={stacks}
        value={profile.stack}
        onChange={(value) => updateProfile("stack", value as Stack)}
      />
      <Fieldset
        label="Experience Level"
        options={levels}
        value={profile.level}
        onChange={(value) => updateProfile("level", value as ExperienceLevel)}
      />
      <Fieldset
        label="Goal"
        options={goals}
        value={profile.goal}
        onChange={(value) => updateProfile("goal", value as Goal)}
      />
      <Button type="submit" className="w-full sm:w-auto">
        Continue to Questions
      </Button>
    </form>
  );
}

type FieldsetProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

function Fieldset({ label, options, value, onChange }: FieldsetProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-zinc-50">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            className={`flex min-h-12 cursor-pointer items-center rounded-md border px-3 text-sm font-medium transition ${
              value === option
                ? "border-emerald-400 bg-emerald-400/15 text-emerald-100"
                : "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-600"
            }`}
            key={option}
          >
            <input
              checked={value === option}
              className="sr-only"
              name={label}
              onChange={() => onChange(option)}
              type="radio"
              value={option}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
