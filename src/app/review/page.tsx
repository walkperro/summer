"use client";

import { useEffect, useMemo, useState } from "react";

type PromptManifest = {
  id: string;
  title: string;
  section: string;
  workflow: string;
  use_case: string;
  aspect_ratio: string;
  prompt: string;
  avoid: string[];
  recommended_framing: string;
  export_goal: string;
  reference_root: string;
  attachments: Array<{
    role: string;
    relativePath: string;
    absolutePath: string;
    exists: boolean;
  }>;
  creative_direction: {
    composition_language: {
      text_safe_guidance: string;
      mobile_crop_safety_guidance: string;
      subject_placement: string;
    };
    realism_guards: {
      skin_texture_rules: string[];
      anti_generic_ai_face_negatives: string[];
    };
  };
};

type GenerationState = {
  loading: boolean;
  error: string | null;
  imageDataUrl?: string;
  responseText?: string;
};

export default function ReviewPage() {
  const [prompts, setPrompts] = useState<PromptManifest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [generationState, setGenerationState] = useState<Record<string, GenerationState>>({});

  useEffect(() => {
    async function loadPrompts() {
      try {
        const response = await fetch("/api/review/prompts");
        const data = (await response.json()) as { prompts?: PromptManifest[]; error?: string };

        if (!response.ok || !data.prompts) {
          throw new Error(data.error || "Failed to load review prompts.");
        }

        setPrompts(data.prompts);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Unknown loading error.");
      } finally {
        setLoading(false);
      }
    }

    loadPrompts();
  }, []);

  const missingReferences = useMemo(
    () => prompts.flatMap((prompt) => prompt.attachments.filter((attachment) => !attachment.exists)),
    [prompts],
  );

  async function generate(promptId: string) {
    setGenerationState((current) => ({
      ...current,
      [promptId]: {
        ...current[promptId],
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await fetch("/api/review/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ promptId }),
      });

      const data = (await response.json()) as {
        imageDataUrl?: string;
        responseText?: string;
        error?: string;
        details?: string;
      };

      if (!response.ok || !data.imageDataUrl) {
        throw new Error(data.details || data.error || "Generation failed.");
      }

      setGenerationState((current) => ({
        ...current,
        [promptId]: {
          loading: false,
          error: null,
          imageDataUrl: data.imageDataUrl,
          responseText: data.responseText,
        },
      }));
    } catch (error) {
      setGenerationState((current) => ({
        ...current,
        [promptId]: {
          loading: false,
          error: error instanceof Error ? error.message : "Unknown generation error.",
        },
      }));
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#1d1b18]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-10">
        <header className="flex flex-col gap-4 border-b border-black/10 pb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-black/50">Summer / Gemini Review</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Editorial prompt review wall for Gemini image generations.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-black/65 md:text-lg">
            This page uses the upgraded prompt pack, attaches the local reference images listed in the pack,
            and generates review-first images before any 4K finishing pass.
          </p>
        </header>

        <section className="grid gap-4 rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Status</p>
            <p className="mt-2 text-2xl font-semibold">{loading ? "Loading" : `${prompts.length} prompts ready`}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Reference root</p>
            <p className="mt-2 break-all text-sm leading-6 text-black/70">
              {prompts[0]?.reference_root || "./public/references"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Missing attachments</p>
            <p className="mt-2 text-2xl font-semibold">{missingReferences.length}</p>
          </div>
        </section>

        {loadError ? (
          <section className="rounded-3xl border border-red-300 bg-red-50 p-6 text-red-800">
            <p className="font-semibold">Failed to load prompts</p>
            <p className="mt-2 text-sm">{loadError}</p>
          </section>
        ) : null}

        {missingReferences.length > 0 ? (
          <section className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-950">
            <p className="font-semibold">Reference warning</p>
            <p className="mt-2 text-sm leading-6">
              Some attachments are missing. Local generation will fail until those files are available under the
              configured reference root.
            </p>
          </section>
        ) : null}

        <section className="grid gap-6">
          {prompts.map((prompt) => {
            const state = generationState[prompt.id];

            return (
              <article key={prompt.id} className="grid gap-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-black px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white">
                      {prompt.section}
                    </span>
                    <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/60">
                      {prompt.aspect_ratio}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight">{prompt.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-black/65">{prompt.use_case}</p>
                  </div>

                  <div className="rounded-3xl bg-[#f7f4ef] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-black/45">Master prompt</p>
                    <p className="mt-3 text-sm leading-7 text-black/80">{prompt.prompt}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-black/10 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">Text-safe guidance</p>
                      <p className="mt-2 text-sm leading-6 text-black/75">
                        {prompt.creative_direction.composition_language.text_safe_guidance}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-black/10 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">Mobile crop safety</p>
                      <p className="mt-2 text-sm leading-6 text-black/75">
                        {prompt.creative_direction.composition_language.mobile_crop_safety_guidance}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-black/10 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">Skin realism rules</p>
                      <ul className="mt-2 space-y-2 text-sm leading-6 text-black/75">
                        {prompt.creative_direction.realism_guards.skin_texture_rules.map((rule) => (
                          <li key={rule}>- {rule}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-3xl border border-black/10 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">Anti-generic negatives</p>
                      <ul className="mt-2 space-y-2 text-sm leading-6 text-black/75">
                        {prompt.creative_direction.realism_guards.anti_generic_ai_face_negatives.map((rule) => (
                          <li key={rule}>- {rule}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-black/10 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-black/45">Reference attachments</p>
                        <p className="mt-2 text-sm text-black/60">{prompt.attachments.length} files attached for Gemini</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => generate(prompt.id)}
                        disabled={state?.loading || prompt.attachments.some((attachment) => !attachment.exists)}
                        className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:bg-black/20"
                      >
                        {state?.loading ? "Generating…" : "Generate review image"}
                      </button>
                    </div>

                    <ul className="mt-4 grid gap-2 text-xs leading-5 text-black/60 md:grid-cols-2">
                      {prompt.attachments.map((attachment) => (
                        <li key={attachment.absolutePath} className="rounded-2xl bg-[#f7f4ef] px-3 py-2">
                          <span className="font-semibold uppercase tracking-[0.16em]">{attachment.role}</span>
                          {" — "}
                          {attachment.relativePath}
                          {!attachment.exists ? " (missing)" : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex min-h-[28rem] items-center justify-center overflow-hidden rounded-[2rem] border border-black/10 bg-[#ebe5dc]">
                    {state?.imageDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={state.imageDataUrl} alt={prompt.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="max-w-sm px-6 text-center text-sm leading-7 text-black/45">
                        Generate a first-pass review image here. This is the decision wall before any upscale or 4K finishing.
                      </div>
                    )}
                  </div>

                  {state?.error ? (
                    <div className="rounded-3xl border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-800">
                      {state.error}
                    </div>
                  ) : null}

                  {state?.responseText ? (
                    <div className="rounded-3xl border border-black/10 bg-[#f7f4ef] p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">Gemini notes</p>
                      <p className="mt-2 text-sm leading-6 text-black/70">{state.responseText}</p>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
