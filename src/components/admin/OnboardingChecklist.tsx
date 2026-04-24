import { AdminCard } from "@/components/admin/AdminCard";

export type OnboardingStep = {
  label: string;
  done: boolean;
  href?: string;
  hint?: string;
};

export function OnboardingChecklist({ steps }: { steps: OnboardingStep[] }) {
  const remaining = steps.filter((s) => !s.done).length;
  return (
    <AdminCard>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#a8896b]">Launch checklist</p>
          <h2 className="font-editorial mt-2 text-3xl leading-none tracking-[-0.01em]">
            {remaining === 0 ? "You're ready to sell." : `${remaining} step${remaining === 1 ? "" : "s"} to launch`}
          </h2>
        </div>
      </div>
      <ol className="mt-6 space-y-3">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-4 border-t border-black/6 pt-3">
            <span
              className={`mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                step.done ? "border-[#a8896b] bg-[#a8896b] text-white" : "border-black/20 bg-white text-[#8a7d72]"
              }`}
              aria-hidden="true"
            >
              {step.done ? "✓" : idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-sm ${step.done ? "line-through decoration-[#a8896b] decoration-1 text-[#7a6f67]" : "text-[#181512]"}`}>
                {step.href ? (
                  <a href={step.href} className="accent-underline">
                    {step.label}
                  </a>
                ) : (
                  step.label
                )}
              </p>
              {step.hint ? <p className="mt-1 text-xs text-[#7a6f67]">{step.hint}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </AdminCard>
  );
}
