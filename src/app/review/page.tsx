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

type FitReference = {
  id: string;
  title: string;
  previewUrl: string;
  available: boolean;
  tags: string[];
  description?: string;
};

type FitAsset = {
  url: string;
  downloadUrl?: string;
  pathname: string;
};

type FitPrompt = {
  id: string;
  title: string;
  use_case: string;
  recommended_framing: string;
  export_goal: string;
  prompt: string;
  recommendedReferenceIds: string[];
};

type FitManifest = {
  fitCampaignPrompts: FitPrompt[];
  fitEnhancementPrompt: {
    id: string;
    title: string;
    use_case: string;
    prompt: string;
  };
  aspectRatios: Array<{ id: string; title: string }>;
  outputModes: Array<{ id: string; title: string; instruction: string }>;
  enhancementModes: Array<{ id: string; title: string; instruction: string }>;
  references: FitReference[];
  referenceSource: string;
  storageConfigured: boolean;
};

type FitCampaignResult = {
  promptId: string;
  aspectRatio: string;
  outputMode: string;
  asset: FitAsset;
  responseText?: string;
  references: FitReference[];
  decision?: "approve" | "reject";
};

type FitEnhancementResult = {
  sourceId: string;
  enhancementMode: string;
  source?: FitReference;
  asset: FitAsset;
  responseText?: string;
  decision?: "approve" | "reject";
};

type AsyncState = {
  loading: boolean;
  error: string | null;
};

type TabId = "prompt-review" | "fit-generate" | "fit-enhance";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "prompt-review", label: "Prompt Review Wall" },
  { id: "fit-generate", label: "Generate Fit Campaign" },
  { id: "fit-enhance", label: "Enhance Original Fit Ref" },
];

function buttonClass(isActive: boolean) {
  return isActive
    ? "rounded-full bg-black px-4 py-2 text-sm font-medium text-white"
    : "rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/65 transition hover:border-black/25 hover:text-black";
}

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<TabId>("prompt-review");
  const [prompts, setPrompts] = useState<PromptManifest[]>([]);
  const [fitManifest, setFitManifest] = useState<FitManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [generationState, setGenerationState] = useState<Record<string, GenerationState>>({});

  const [selectedFitPromptId, setSelectedFitPromptId] = useState("");
  const [selectedReferenceIds, setSelectedReferenceIds] = useState<string[]>([]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9");
  const [selectedOutputMode, setSelectedOutputMode] = useState("high_end");
  const [fitGenerateState, setFitGenerateState] = useState<AsyncState>({ loading: false, error: null });
  const [fitCampaignResults, setFitCampaignResults] = useState<FitCampaignResult[]>([]);

  const [selectedEnhancementSourceId, setSelectedEnhancementSourceId] = useState("");
  const [selectedEnhancementMode, setSelectedEnhancementMode] = useState("natural_cleanup");
  const [fitEnhanceState, setFitEnhanceState] = useState<AsyncState>({ loading: false, error: null });
  const [fitEnhancementResults, setFitEnhancementResults] = useState<FitEnhancementResult[]>([]);

  useEffect(() => {
    async function loadImageLab() {
      try {
        const [promptResponse, fitResponse] = await Promise.all([
          fetch("/api/review/prompts"),
          fetch("/api/review/fit/manifest"),
        ]);

        const promptData = (await promptResponse.json()) as { prompts?: PromptManifest[]; error?: string };
        const fitData = (await fitResponse.json()) as FitManifest & { error?: string };

        if (!promptResponse.ok || !promptData.prompts) {
          throw new Error(promptData.error || "Failed to load review prompts.");
        }

        if (!fitResponse.ok) {
          throw new Error(fitData.error || "Failed to load fit image lab.");
        }

        setPrompts(promptData.prompts);
        setFitManifest(fitData);

        const availableReferences = fitData.references.filter((reference) => reference.available);
        if (fitData.fitCampaignPrompts[0]) {
          setSelectedFitPromptId(fitData.fitCampaignPrompts[0].id);
        }
        if (availableReferences[0]) {
          setSelectedEnhancementSourceId(availableReferences[0].id);
        }
        if (availableReferences.length >= 2) {
          setSelectedReferenceIds(availableReferences.slice(0, Math.min(3, availableReferences.length)).map((reference) => reference.id));
        }
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Unknown loading error.");
      } finally {
        setLoading(false);
      }
    }

    loadImageLab();
  }, []);

  const missingReferences = useMemo(
    () => prompts.flatMap((prompt) => prompt.attachments.filter((attachment) => !attachment.exists)),
    [prompts],
  );

  const fitReferences = useMemo(() => fitManifest?.references ?? [], [fitManifest]);
  const selectedFitPrompt = fitManifest?.fitCampaignPrompts.find((prompt) => prompt.id === selectedFitPromptId) ?? null;
  const selectedSourceReference = fitReferences.find((reference) => reference.id === selectedEnhancementSourceId) ?? null;
  const selectedReferenceCount = selectedReferenceIds.length;
  const fitWorkflowUnavailable = !fitManifest?.storageConfigured || fitReferences.length === 0;

  useEffect(() => {
    if (!selectedFitPrompt || fitReferences.length === 0) {
      return;
    }

    const availableReferenceIds = new Set(fitReferences.filter((reference) => reference.available).map((reference) => reference.id));
    const recommended = selectedFitPrompt.recommendedReferenceIds.filter((referenceId) => availableReferenceIds.has(referenceId));

    if (recommended.length >= 2) {
      setSelectedReferenceIds(recommended.slice(0, 4));
    }
  }, [selectedFitPromptId, selectedFitPrompt, fitReferences]);

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

  function toggleFitReference(referenceId: string) {
    setSelectedReferenceIds((current) => {
      if (current.includes(referenceId)) {
        return current.filter((item) => item !== referenceId);
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, referenceId];
    });
  }

  async function runFitGeneration() {
    if (!selectedFitPromptId) return;

    setFitGenerateState({ loading: true, error: null });

    try {
      const response = await fetch("/api/review/fit/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: selectedFitPromptId,
          referenceIds: selectedReferenceIds,
          aspectRatio: selectedAspectRatio,
          outputMode: selectedOutputMode,
        }),
      });

      const data = (await response.json()) as FitCampaignResult & { error?: string };

      if (!response.ok || !data.asset) {
        throw new Error(data.error || "Fit campaign generation failed.");
      }

      setFitCampaignResults((current) => [data, ...current]);
      setFitGenerateState({ loading: false, error: null });
    } catch (error) {
      setFitGenerateState({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown fit campaign generation error.",
      });
    }
  }

  async function runFitEnhancement() {
    if (!selectedEnhancementSourceId) return;

    setFitEnhanceState({ loading: true, error: null });

    try {
      const response = await fetch("/api/review/fit/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceId: selectedEnhancementSourceId,
          enhancementMode: selectedEnhancementMode,
        }),
      });

      const data = (await response.json()) as FitEnhancementResult & { error?: string };

      if (!response.ok || !data.asset) {
        throw new Error(data.error || "Fit enhancement failed.");
      }

      setFitEnhancementResults((current) => [data, ...current]);
      setFitEnhanceState({ loading: false, error: null });
    } catch (error) {
      setFitEnhanceState({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown fit enhancement error.",
      });
    }
  }

  async function recordDecision(
    workflow: "fit_generate_campaign" | "fit_enhance_reference",
    assetPathname: string,
    decision: "approve" | "reject",
    context: Record<string, unknown>,
  ) {
    const response = await fetch("/api/review/fit/decision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workflow, assetPathname, decision, context }),
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      throw new Error(data.error || "Failed to save decision.");
    }
  }

  async function handleCampaignDecision(result: FitCampaignResult, decision: "approve" | "reject") {
    try {
      await recordDecision("fit_generate_campaign", result.asset.pathname, decision, {
        promptId: result.promptId,
        aspectRatio: result.aspectRatio,
        outputMode: result.outputMode,
        referenceIds: result.references.map((reference) => reference.id),
      });

      setFitCampaignResults((current) =>
        current.map((entry) =>
          entry.asset.pathname === result.asset.pathname ? { ...entry, decision } : entry,
        ),
      );
    } catch (error) {
      setFitGenerateState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to save campaign decision.",
      });
    }
  }

  async function handleEnhancementDecision(result: FitEnhancementResult, decision: "approve" | "reject") {
    try {
      await recordDecision("fit_enhance_reference", result.asset.pathname, decision, {
        sourceId: result.sourceId,
        enhancementMode: result.enhancementMode,
      });

      setFitEnhancementResults((current) =>
        current.map((entry) =>
          entry.asset.pathname === result.asset.pathname ? { ...entry, decision } : entry,
        ),
      );
    } catch (error) {
      setFitEnhanceState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to save enhancement decision.",
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#1d1b18]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-10">
        <header className="flex flex-col gap-4 border-b border-black/10 pb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-black/50">Summer / Image Lab</p>
          <h1 className="max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">
            Editorial image lab for prompt review, Train With Me campaign generation, and source-preserved fit enhancement.
          </h1>
          <p className="max-w-4xl text-base leading-7 text-black/65 md:text-lg">
            Review the existing prompt wall, generate matched luxury fitness campaign images from `summer_fit`, or enhance an original fit reference with a premium editorial sports finish.
          </p>
        </header>

        <section className="grid gap-4 rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm md:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Prompt wall</p>
            <p className="mt-2 text-2xl font-semibold">{loading ? "Loading" : `${prompts.length} ready`}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Fit references</p>
            <p className="mt-2 text-2xl font-semibold">{loading ? "—" : fitReferences.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Reference source</p>
            <p className="mt-2 text-sm leading-6 text-black/70">{fitManifest?.referenceSource || prompts[0]?.reference_root || "Loading…"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Blob storage</p>
            <p className="mt-2 text-2xl font-semibold">{fitManifest?.storageConfigured ? "Ready" : "Missing"}</p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={buttonClass(activeTab === tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {loadError ? (
          <section className="rounded-3xl border border-red-300 bg-red-50 p-6 text-red-800">
            <p className="font-semibold">Failed to load image lab</p>
            <p className="mt-2 text-sm">{loadError}</p>
          </section>
        ) : null}

        {activeTab === "prompt-review" ? (
          <>
            {missingReferences.length > 0 ? (
              <section className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-950">
                <p className="font-semibold">Reference warning</p>
                <p className="mt-2 text-sm leading-6">
                  Some prompt-pack attachments are missing from the server-side reference provider. Legacy review generation will fail until they are restored.
                </p>
              </section>
            ) : null}

            <section className="grid gap-6">
              {prompts.map((prompt) => {
                const state = generationState[prompt.id];

                return (
                  <article
                    key={prompt.id}
                    className="grid gap-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]"
                  >
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
                            <li key={`${prompt.id}-${attachment.relativePath}`} className="rounded-2xl bg-[#f7f4ef] px-3 py-2">
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
                            Generate a first-pass review image here. This remains the decision wall before any upscale or 4K finishing pass.
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
          </>
        ) : null}

        {activeTab === "fit-generate" ? (
          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col gap-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Workflow A</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Generate Fit Campaign</h2>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  Build matched Train With Me campaign-family images using 2 to 4 `summer_fit` references as pose, athletic-intent, and likeness anchors.
                </p>
              </div>

              {!fitManifest?.storageConfigured ? (
                <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  Blob storage is not configured. Add `BLOB_READ_WRITE_TOKEN` to enable saved fit campaign outputs.
                </div>
              ) : null}

              {fitReferences.length === 0 ? (
                <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  No `summer_fit` refs are available right now. Add files under `public/references/summer_fit` or provide `SUMMER_FIT_REFERENCE_MANIFEST_JSON` for a Blob-backed manifest later.
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="rounded-3xl border border-black/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">Fit prompt preset</p>
                  <select
                    value={selectedFitPromptId}
                    onChange={(event) => setSelectedFitPromptId(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm text-black outline-none"
                  >
                    {fitManifest?.fitCampaignPrompts.map((prompt) => (
                      <option key={prompt.id} value={prompt.id}>
                        {prompt.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-3xl border border-black/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">Aspect ratio</p>
                  <select
                    value={selectedAspectRatio}
                    onChange={(event) => setSelectedAspectRatio(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm text-black outline-none"
                  >
                    {fitManifest?.aspectRatios.map((aspectRatio) => (
                      <option key={aspectRatio.id} value={aspectRatio.id}>
                        {aspectRatio.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="rounded-3xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Output mode</p>
                <select
                  value={selectedOutputMode}
                  onChange={(event) => setSelectedOutputMode(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm text-black outline-none"
                >
                  {fitManifest?.outputModes.map((outputMode) => (
                    <option key={outputMode.id} value={outputMode.id}>
                      {outputMode.title}
                    </option>
                  ))}
                </select>
              </label>

              {selectedFitPrompt ? (
                <div className="rounded-3xl bg-[#f7f4ef] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">Selected direction</p>
                  <h3 className="mt-2 text-xl font-semibold">{selectedFitPrompt.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-black/75">{selectedFitPrompt.prompt}</p>
                </div>
              ) : null}

              <div className="rounded-3xl border border-black/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/45">summer_fit references</p>
                    <p className="mt-2 text-sm leading-6 text-black/60">Select 2 to 4 references to lock the same woman, pose intent, and premium sports campaign family.</p>
                  </div>
                  <p className="rounded-full bg-[#f7f4ef] px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/60">
                    {selectedReferenceCount}/4 selected
                  </p>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {fitReferences.map((reference) => {
                    const selected = selectedReferenceIds.includes(reference.id);

                    return (
                      <button
                        key={reference.id}
                        type="button"
                        onClick={() => toggleFitReference(reference.id)}
                        disabled={!reference.available}
                        className={`overflow-hidden rounded-[1.5rem] border text-left transition ${selected ? "border-black bg-black text-white" : "border-black/10 bg-[#f7f4ef] text-black"} ${!reference.available ? "cursor-not-allowed opacity-40" : "hover:border-black/25"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={reference.previewUrl} alt={reference.title} className="h-44 w-full object-cover" />
                        <div className="space-y-2 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">{reference.title}</p>
                            <span className="rounded-full border border-current/15 px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
                              {selected ? "Selected" : "Tap to add"}
                            </span>
                          </div>
                          <p className={`text-xs leading-5 ${selected ? "text-white/75" : "text-black/55"}`}>
                            {reference.tags.length > 0 ? reference.tags.join(" • ") : "General fit anchor"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {fitGenerateState.error ? (
                <div className="rounded-3xl border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-800">
                  {fitGenerateState.error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={runFitGeneration}
                disabled={fitWorkflowUnavailable || selectedReferenceCount < 2 || selectedReferenceCount > 4 || fitGenerateState.loading}
                className="rounded-full bg-black px-5 py-4 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:bg-black/20"
              >
                {fitGenerateState.loading ? "Generating fit campaign…" : "Generate fit campaign image"}
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {fitCampaignResults.length === 0 ? (
                <div className="flex min-h-[32rem] items-center justify-center rounded-[2rem] border border-black/10 bg-white p-10 text-center text-sm leading-7 text-black/45 shadow-sm">
                  Generate a Train With Me image to preview the saved Blob output here with download, approve, and reject controls.
                </div>
              ) : null}

              {fitCampaignResults.map((result) => {
                const promptTitle = fitManifest?.fitCampaignPrompts.find((prompt) => prompt.id === result.promptId)?.title ?? result.promptId;
                const outputModeTitle = fitManifest?.outputModes.find((mode) => mode.id === result.outputMode)?.title ?? result.outputMode;

                return (
                  <article key={result.asset.pathname} className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-black/45">Saved to Blob</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{promptTitle}</h3>
                        <p className="mt-2 text-sm text-black/60">
                          {result.aspectRatio} • {outputModeTitle} • {result.references.length} refs
                        </p>
                      </div>
                      {result.decision ? (
                        <span className="rounded-full bg-[#f7f4ef] px-3 py-2 text-xs uppercase tracking-[0.2em] text-black/65">
                          {result.decision}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#ebe5dc]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={result.asset.url} alt={promptTitle} className="h-full w-full object-cover" />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <a
                        href={result.asset.downloadUrl || result.asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm font-medium text-black/75 transition hover:border-black/25 hover:text-black"
                      >
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCampaignDecision(result, "approve")}
                        className="rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/85"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCampaignDecision(result, "reject")}
                        className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
                      >
                        Reject
                      </button>
                    </div>

                    <div className="mt-4 rounded-3xl bg-[#f7f4ef] p-4 text-sm leading-6 text-black/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">Reference stack</p>
                      <p className="mt-2">{result.references.map((reference) => reference.title).join(" • ")}</p>
                      {result.responseText ? <p className="mt-3">{result.responseText}</p> : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {activeTab === "fit-enhance" ? (
          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col gap-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Workflow B</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Enhance Original Fit Ref</h2>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  Improve one selected `summer_fit` original without rebuilding the composition. Keep the same pose, framing, identity, and core shot intact.
                </p>
              </div>

              <label className="rounded-3xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Source image</p>
                <select
                  value={selectedEnhancementSourceId}
                  onChange={(event) => setSelectedEnhancementSourceId(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm text-black outline-none"
                >
                  {fitReferences.map((reference) => (
                    <option key={reference.id} value={reference.id}>
                      {reference.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="rounded-3xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Enhancement mode</p>
                <select
                  value={selectedEnhancementMode}
                  onChange={(event) => setSelectedEnhancementMode(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm text-black outline-none"
                >
                  {fitManifest?.enhancementModes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.title}
                    </option>
                  ))}
                </select>
              </label>

              {selectedSourceReference ? (
                <div className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#f7f4ef]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedSourceReference.previewUrl} alt={selectedSourceReference.title} className="h-72 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-sm font-semibold">{selectedSourceReference.title}</p>
                    <p className="mt-2 text-xs leading-5 text-black/55">
                      {selectedSourceReference.tags.length > 0 ? selectedSourceReference.tags.join(" • ") : "Original fit reference"}
                    </p>
                  </div>
                </div>
              ) : null}

              {fitEnhanceState.error ? (
                <div className="rounded-3xl border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-800">
                  {fitEnhanceState.error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={runFitEnhancement}
                disabled={fitWorkflowUnavailable || !selectedEnhancementSourceId || fitEnhanceState.loading}
                className="rounded-full bg-black px-5 py-4 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:bg-black/20"
              >
                {fitEnhanceState.loading ? "Enhancing fit ref…" : "Enhance original fit ref"}
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {fitEnhancementResults.length === 0 ? (
                <div className="flex min-h-[32rem] items-center justify-center rounded-[2rem] border border-black/10 bg-white p-10 text-center text-sm leading-7 text-black/45 shadow-sm">
                  Enhance a `summer_fit` source image to review the before-and-after comparison and saved Blob output here.
                </div>
              ) : null}

              {fitEnhancementResults.map((result) => {
                const modeTitle = fitManifest?.enhancementModes.find((mode) => mode.id === result.enhancementMode)?.title ?? result.enhancementMode;

                return (
                  <article key={result.asset.pathname} className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-black/45">Before / after</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{result.source?.title || result.sourceId}</h3>
                        <p className="mt-2 text-sm text-black/60">{modeTitle}</p>
                      </div>
                      {result.decision ? (
                        <span className="rounded-full bg-[#f7f4ef] px-3 py-2 text-xs uppercase tracking-[0.2em] text-black/65">
                          {result.decision}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#ebe5dc]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={result.source?.previewUrl || ""} alt={`${result.source?.title || result.sourceId} before`} className="h-full w-full object-cover" />
                        <div className="border-t border-black/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-black/45">Before</div>
                      </div>
                      <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#ebe5dc]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={result.asset.url} alt={`${result.source?.title || result.sourceId} after`} className="h-full w-full object-cover" />
                        <div className="border-t border-black/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-black/45">After</div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <a
                        href={result.asset.downloadUrl || result.asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm font-medium text-black/75 transition hover:border-black/25 hover:text-black"
                      >
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={() => handleEnhancementDecision(result, "approve")}
                        className="rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/85"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEnhancementDecision(result, "reject")}
                        className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
                      >
                        Reject
                      </button>
                    </div>

                    {result.responseText ? (
                      <div className="mt-4 rounded-3xl bg-[#f7f4ef] p-4 text-sm leading-6 text-black/70">{result.responseText}</div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
