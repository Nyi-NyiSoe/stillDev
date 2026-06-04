type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div aria-label={`Question ${current} of ${total}`} className="space-y-2">
      <div className="flex items-center justify-between text-sm font-medium text-zinc-600">
        <span>
          Question {current}/{total}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-zinc-950 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
