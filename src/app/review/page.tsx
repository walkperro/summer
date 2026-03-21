"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  applyCameraPresetToggle,
  getCameraDirectionWarnings as getSharedCameraDirectionWarnings,
  getCameraSelectionSummary,
  normalizeCameraPresetIds,
  type CameraDirectionPresetId,
} from "@/lib/camera-direction";

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

type PreserveFlags = {
  preserve_face: boolean;
  preserve_composition: boolean;
  preserve_background: boolean;
  preserve_outfit: boolean;
  preserve_body_shape: boolean;
  preserve_pose: boolean;
  allow_reframing: boolean;
  allow_perspective_shift: boolean;
};

type RefinementPreset = {
  id: string;
  title: string;
  summary: string;
  recommendedUse: string;
  instructions: string[];
  orderGuidance: string;
};

type CameraOption = {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  previewLabel: string;
  previewAccent: string;
  previewImageUrl: string;
  previewAlt: string;
  kind: "angle" | "lens";
  category: "angle_core" | "framing_modifier" | "lens_core" | "experimental_modifier";
};

type RefinementRecipe = {
  id: string;
  title: string;
  stack: string[];
};

type CameraRecipe = {
  id: string;
  title: string;
  preset_ids: CameraDirectionPresetId[];
  reframe_intensity: "subtle" | "moderate" | "strong";
};

type StackWarning = {
  id: string;
  level: "warning";
  message: string;
};

type FitPrompt = {
  id: string;
  title: string;
  use_case: string;
  recommended_framing: string;
  export_goal: string;
  prompt: string;
  recommendedFitReferenceIds: string[];
  recommendedLikenessReferenceIds: string[];
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
  fitReferences: FitReference[];
  fitReferenceSource: string;
  likenessReferences: FitReference[];
  likenessReferenceSource: string;
  refinementPresets: RefinementPreset[];
  refinementRecipes: RefinementRecipe[];
  cameraAngleOptions: CameraOption[];
  lensLookOptions: CameraOption[];
  cameraRecipes: CameraRecipe[];
  defaultPreserveFlags: PreserveFlags;
  refinementHelp: string[];
  storageConfigured: boolean;
};

type FitCampaignResult = {
  promptId: string;
  aspectRatio: string;
  outputMode: string;
  asset: FitAsset;
  responseText?: string;
  fit_refs_used: FitReference[];
  likeness_refs_used: FitReference[];
  warning?: string | null;
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

type RefineSource = {
  id: string;
  title: string;
  sourceType: "generated" | "enhanced" | "uploaded";
  previewUrl: string;
  imageUrl?: string;
  imageDataUrl?: string;
  assetPathname?: string;
  subtitle: string;
};

type RefineResult = {
  savedToBlob: boolean;
  temporary?: boolean;
  asset?: FitAsset;
  imageDataUrl?: string;
  metadata: {
    source_image_id: string;
    source_type: "generated" | "enhanced" | "uploaded";
    refinement_stack: string[];
    custom_instruction_text: string;
    preserve_flags: PreserveFlags;
    output_size: string;
    created_at: string;
    source_title: string;
    keep_original_aspect_ratio: boolean;
    camera_preset_ids: string[];
    camera_angle: string;
    lens_look: string;
    camera_modifiers: string[];
    camera_direction_narrative: string;
    reframe_intensity: string;
    allow_reframing: boolean;
    allow_perspective_shift: boolean;
    model: string;
  };
  stackWarnings?: StackWarning[];
  responseText?: string;
  warning?: string;
  decision?: "approve" | "reject";
};

type AsyncState = {
  loading: boolean;
  error: string | null;
};

type TabId = "prompt-review" | "fit-generate" | "fit-enhance" | "fit-refine";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "prompt-review", label: "Prompt Review Wall" },
  { id: "fit-generate", label: "Generate Fit Campaign" },
  { id: "fit-enhance", label: "Enhance Original Fit Ref" },
  { id: "fit-refine", label: "Refine Final Images" },
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
  const [selectedFitReferenceIds, setSelectedFitReferenceIds] = useState<string[]>([]);
  const [selectedLikenessReferenceIds, setSelectedLikenessReferenceIds] = useState<string[]>([]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9");
  const [selectedOutputMode, setSelectedOutputMode] = useState("high_end");
  const [fitGenerateState, setFitGenerateState] = useState<AsyncState>({ loading: false, error: null });
  const [fitCampaignResults, setFitCampaignResults] = useState<FitCampaignResult[]>([]);

  const [selectedEnhancementSourceId, setSelectedEnhancementSourceId] = useState("");
  const [selectedEnhancementMode, setSelectedEnhancementMode] = useState("natural_cleanup");
  const [fitEnhanceState, setFitEnhanceState] = useState<AsyncState>({ loading: false, error: null });
  const [fitEnhancementResults, setFitEnhancementResults] = useState<FitEnhancementResult[]>([]);

  const [selectedRefineSourceId, setSelectedRefineSourceId] = useState("");
  const [uploadedRefineSource, setUploadedRefineSource] = useState<RefineSource | null>(null);
  const [availablePresetToAdd, setAvailablePresetToAdd] = useState("final_luxury_finish");
  const [selectedRefinementStack, setSelectedRefinementStack] = useState<string[]>(["final_luxury_finish"]);
  const [refinementCustomInstruction, setRefinementCustomInstruction] = useState("");
  const [refinementPreserveFlags, setRefinementPreserveFlags] = useState<PreserveFlags>({
    preserve_face: true,
    preserve_composition: true,
    preserve_background: true,
    preserve_outfit: true,
    preserve_body_shape: true,
    preserve_pose: true,
    allow_reframing: false,
    allow_perspective_shift: false,
  });
  const [selectedCameraPresetIds, setSelectedCameraPresetIds] = useState<CameraDirectionPresetId[]>(() =>
    normalizeCameraPresetIds(["keep_original_angle", "keep_original_lens_feel"]),
  );
  const [cameraSelectionFeedback, setCameraSelectionFeedback] = useState<string | null>(null);
  const [showReframingHelp, setShowReframingHelp] = useState(false);
  const [selectedReframeIntensity, setSelectedReframeIntensity] = useState<"subtle" | "moderate" | "strong">("subtle");
  const [refineExport4k, setRefineExport4k] = useState(false);
  const [refineKeepOriginalAspectRatio, setRefineKeepOriginalAspectRatio] = useState(true);
  const [fitRefineState, setFitRefineState] = useState<AsyncState>({ loading: false, error: null });
  const [fitRefineResults, setFitRefineResults] = useState<RefineResult[]>([]);

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

        const availableFitReferences = fitData.fitReferences.filter((reference) => reference.available);
        const availableLikenessReferences = fitData.likenessReferences.filter((reference) => reference.available);
        if (fitData.fitCampaignPrompts[0]) {
          setSelectedFitPromptId(fitData.fitCampaignPrompts[0].id);
        }
        if (availableFitReferences[0]) {
          setSelectedEnhancementSourceId(availableFitReferences[0].id);
        }
        if (availableFitReferences.length >= 1) {
          setSelectedFitReferenceIds(availableFitReferences.slice(0, Math.min(2, availableFitReferences.length)).map((reference) => reference.id));
        }
        if (availableLikenessReferences.length >= 1) {
          setSelectedLikenessReferenceIds(
            availableLikenessReferences.slice(0, Math.min(2, availableLikenessReferences.length)).map((reference) => reference.id),
          );
        }
        setRefinementPreserveFlags(fitData.defaultPreserveFlags);
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

  const fitReferences = useMemo(() => fitManifest?.fitReferences ?? [], [fitManifest]);
  const likenessReferences = useMemo(() => fitManifest?.likenessReferences ?? [], [fitManifest]);
  const selectedFitPrompt = fitManifest?.fitCampaignPrompts.find((prompt) => prompt.id === selectedFitPromptId) ?? null;
  const selectedSourceReference = fitReferences.find((reference) => reference.id === selectedEnhancementSourceId) ?? null;
  const selectedFitReferenceCount = selectedFitReferenceIds.length;
  const selectedLikenessReferenceCount = selectedLikenessReferenceIds.length;
  const fitWorkflowUnavailable = !fitManifest?.storageConfigured || fitReferences.length === 0;
  const refineSourceOptions = useMemo(() => {
    const generatedSources: RefineSource[] = fitCampaignResults.map((result) => ({
      id: `generated-${result.asset.pathname}`,
      title: fitManifest?.fitCampaignPrompts.find((prompt) => prompt.id === result.promptId)?.title ?? result.promptId,
      sourceType: "generated",
      previewUrl: result.asset.url,
      imageUrl: result.asset.url,
      assetPathname: result.asset.pathname,
      subtitle: `Generated • ${result.fit_refs_used.length} fit refs • ${result.likeness_refs_used.length} likeness refs`,
    }));
    const enhancedSources: RefineSource[] = fitEnhancementResults.map((result) => ({
      id: `enhanced-${result.asset.pathname}`,
      title: result.source?.title || result.sourceId,
      sourceType: "enhanced",
      previewUrl: result.asset.url,
      imageUrl: result.asset.url,
      assetPathname: result.asset.pathname,
      subtitle: `Enhanced original • ${result.enhancementMode}`,
    }));

    return [...generatedSources, ...enhancedSources, ...(uploadedRefineSource ? [uploadedRefineSource] : [])];
  }, [fitCampaignResults, fitEnhancementResults, fitManifest, uploadedRefineSource]);
  const selectedRefineSource = refineSourceOptions.find((source) => source.id === selectedRefineSourceId) ?? null;
  const selectedRefinementPresetDefinition =
    fitManifest?.refinementPresets.find((preset) => preset.id === availablePresetToAdd) ?? null;
  const selectedRefinementStackPresets = useMemo(
    () =>
      selectedRefinementStack
        .map((presetId) => fitManifest?.refinementPresets.find((preset) => preset.id === presetId))
        .filter((preset): preset is RefinementPreset => Boolean(preset)),
    [fitManifest, selectedRefinementStack],
  );
  const cameraSelectionSummary = useMemo(
    () => getCameraSelectionSummary(selectedCameraPresetIds as CameraDirectionPresetId[]),
    [selectedCameraPresetIds],
  );
  const refinementStackWarnings = useMemo(() => {
    const warnings: StackWarning[] = [];
    const bwIndex = selectedRefinementStack.indexOf("final_bw_editorial");
    const upscaleIndex = selectedRefinementStack.indexOf("final_4k_upscale");
    const removeLogosIndex = selectedRefinementStack.indexOf("final_remove_logos");
    const softenExpressionIndex = selectedRefinementStack.indexOf("final_soften_expression");
    const slightSmileIndex = selectedRefinementStack.indexOf("final_add_slight_smile");
    const customIndex = selectedRefinementStack.indexOf("final_custom_instruction");

    if (softenExpressionIndex !== -1 && slightSmileIndex !== -1) {
      warnings.push({
        id: "expression-conflict",
        level: "warning",
        message: "`Soften Expression` and `Add Slight Smile` are both in the stack. They can conflict, so verify the final face edit stays subtle and identity-safe.",
      });
    }

    if (bwIndex !== -1 && removeLogosIndex !== -1 && bwIndex < removeLogosIndex) {
      warnings.push({
        id: "bw-before-logo",
        level: "warning",
        message: "`Final B/W Editorial` appears before `Remove Logos`. Logo cleanup usually works better before black-and-white conversion.",
      });
    }

    if (upscaleIndex !== -1 && upscaleIndex !== selectedRefinementStack.length - 1) {
      warnings.push({
        id: "upscale-not-last",
        level: "warning",
        message: "`Final 4K Upscale` is not the last step. It usually works best as the final step in the stack.",
      });
    }

    if (customIndex !== -1 && refinementCustomInstruction.trim()) {
      warnings.push({
        id: "custom-may-conflict",
        level: "warning",
        message: "`Custom Instruction` is in the stack. Review it carefully because it may conflict with neighboring presets.",
      });
    }

    return warnings;
  }, [selectedRefinementStack, refinementCustomInstruction]);
  const cameraDirectionWarnings = useMemo(
    () =>
      getSharedCameraDirectionWarnings({
        presetIds: selectedCameraPresetIds as CameraDirectionPresetId[],
        reframeIntensity: selectedReframeIntensity,
        preserveFlags: refinementPreserveFlags,
      }),
    [selectedCameraPresetIds, selectedReframeIntensity, refinementPreserveFlags],
  );

  useEffect(() => {
    if (!selectedRefineSourceId && refineSourceOptions[0]) {
      setSelectedRefineSourceId(refineSourceOptions[0].id);
    }
  }, [selectedRefineSourceId, refineSourceOptions]);

  useEffect(() => {
    if (!selectedFitPrompt || fitReferences.length === 0) {
      return;
    }

    const availableFitReferenceIds = new Set(fitReferences.filter((reference) => reference.available).map((reference) => reference.id));
    const availableLikenessReferenceIds = new Set(
      likenessReferences.filter((reference) => reference.available).map((reference) => reference.id),
    );
    const recommendedFit = selectedFitPrompt.recommendedFitReferenceIds.filter((referenceId) => availableFitReferenceIds.has(referenceId));
    const recommendedLikeness = selectedFitPrompt.recommendedLikenessReferenceIds.filter((referenceId) =>
      availableLikenessReferenceIds.has(referenceId),
    );

    if (recommendedFit.length >= 1) {
      setSelectedFitReferenceIds(recommendedFit.slice(0, 3));
    }

    if (recommendedLikeness.length >= 1) {
      setSelectedLikenessReferenceIds(recommendedLikeness.slice(0, 2));
    }
  }, [selectedFitPromptId, selectedFitPrompt, fitReferences, likenessReferences]);

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
    setSelectedFitReferenceIds((current) => {
      if (current.includes(referenceId)) {
        return current.filter((item) => item !== referenceId);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, referenceId];
    });
  }

  function toggleLikenessReference(referenceId: string) {
    setSelectedLikenessReferenceIds((current) => {
      if (current.includes(referenceId)) {
        return current.filter((item) => item !== referenceId);
      }

      if (current.length >= 2) {
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
          fitReferenceIds: selectedFitReferenceIds,
          likenessReferenceIds: selectedLikenessReferenceIds,
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
    workflow: "fit_generate_campaign" | "fit_enhance_reference" | "fit_refine_final",
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
        fit_refs_used: result.fit_refs_used.map((reference) => reference.id),
        likeness_refs_used: result.likeness_refs_used.map((reference) => reference.id),
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

  function togglePreserveFlag(flag: keyof PreserveFlags) {
    setRefinementPreserveFlags((current) => ({
      ...current,
      [flag]: !current[flag],
    }));
  }

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("Failed to read file as data URL."));
          return;
        }

        resolve(reader.result);
      };

      reader.onerror = () => reject(new Error("Failed to read uploaded file."));
      reader.readAsDataURL(file);
    });
  }

  async function handleRefineUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      const source: RefineSource = {
        id: `uploaded-${Date.now()}`,
        title: file.name.replace(/\.[^.]+$/, ""),
        sourceType: "uploaded",
        previewUrl: imageDataUrl,
        imageDataUrl,
        subtitle: "Uploaded local image",
      };

      setUploadedRefineSource(source);
      setSelectedRefineSourceId(source.id);
    } catch (error) {
      setFitRefineState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to prepare uploaded refine source.",
      });
    }
  }

  async function fetchImageUrlAsDataUrl(imageUrl: string) {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error("Failed to load source image for refinement.");
    }

    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("Failed to convert source image to data URL."));
          return;
        }

        resolve(reader.result);
      };

      reader.onerror = () => reject(new Error("Failed to convert source image to data URL."));
      reader.readAsDataURL(blob);
    });
  }

  async function resolveRefineSourceDataUrl(source: RefineSource) {
    if (source.imageDataUrl) {
      return source.imageDataUrl;
    }

    if (source.imageUrl) {
      return fetchImageUrlAsDataUrl(source.imageUrl);
    }

    throw new Error("Selected refine source has no available image data.");
  }

  function addPresetToRefinementStack() {
    if (!availablePresetToAdd) {
      return;
    }

    setSelectedRefinementStack((current) => [...current, availablePresetToAdd]);
  }

  function removePresetFromStack(index: number) {
    setSelectedRefinementStack((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function movePresetInStack(index: number, direction: "up" | "down") {
    setSelectedRefinementStack((current) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  }

  function applyRefinementRecipe(recipeId: string) {
    const recipe = fitManifest?.refinementRecipes.find((entry) => entry.id === recipeId);

    if (!recipe) {
      return;
    }

    setSelectedRefinementStack(recipe.stack);
  }

  function applyCameraRecipe(recipeId: string) {
    const recipe = fitManifest?.cameraRecipes.find((entry) => entry.id === recipeId);

    if (!recipe) {
      return;
    }

    setSelectedCameraPresetIds(normalizeCameraPresetIds(recipe.preset_ids));
    setCameraSelectionFeedback(null);
    setSelectedReframeIntensity(recipe.reframe_intensity);
  }

  function toggleCameraPreset(presetId: string) {
    const result = applyCameraPresetToggle(
      selectedCameraPresetIds as CameraDirectionPresetId[],
      presetId as CameraDirectionPresetId,
    );

    setSelectedCameraPresetIds(result.selection);
    setCameraSelectionFeedback(result.warning?.message || null);
  }

  async function runFinalRefinement() {
    if (!selectedRefineSource) {
      setFitRefineState({ loading: false, error: "Select a source image to refine." });
      return;
    }

    if (selectedRefinementStack.length === 0) {
      setFitRefineState({ loading: false, error: "Add at least one refinement preset to the stack." });
      return;
    }

    setFitRefineState({ loading: true, error: null });

    try {
      const sourceImageDataUrl = await resolveRefineSourceDataUrl(selectedRefineSource);
      const response = await fetch("/api/review/fit/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceImageId: selectedRefineSource.assetPathname || selectedRefineSource.id,
          sourceType: selectedRefineSource.sourceType,
          sourceTitle: selectedRefineSource.title,
          sourceImageDataUrl,
          refinementStack: selectedRefinementStack,
          customInstruction: refinementCustomInstruction,
          preserveFlags: refinementPreserveFlags,
          export4k: refineExport4k || selectedRefinementStack.includes("final_4k_upscale"),
          keepOriginalAspectRatio: refineKeepOriginalAspectRatio,
          cameraPresetIds: selectedCameraPresetIds,
          reframeIntensity: selectedReframeIntensity,
        }),
      });

      const data = (await response.json()) as RefineResult & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Final refinement failed.");
      }

      setFitRefineResults((current) => [data, ...current]);
      setFitRefineState({ loading: false, error: null });
    } catch (error) {
      setFitRefineState({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown final refinement error.",
      });
    }
  }

  async function handleRefineDecision(result: RefineResult, decision: "approve" | "reject") {
    if (!result.asset?.pathname) {
      return;
    }

    try {
      await recordDecision("fit_refine_final", result.asset.pathname, decision, {
        source_image_id: result.metadata.source_image_id,
        source_type: result.metadata.source_type,
        refinement_stack: result.metadata.refinement_stack,
        output_size: result.metadata.output_size,
      });

      setFitRefineResults((current) =>
        current.map((entry) =>
          entry.asset?.pathname === result.asset?.pathname ? { ...entry, decision } : entry,
        ),
      );
    } catch (error) {
      setFitRefineState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to save final refine decision.",
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
            <p className="mt-2 text-sm leading-6 text-black/70">
              {fitManifest
                ? `fit: ${fitManifest.fitReferenceSource} • likeness: ${fitManifest.likenessReferenceSource}`
                : prompts[0]?.reference_root || "Loading…"}
            </p>
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
                  Build matched Train With Me campaign-family images by combining fit/action refs for pose and athletic intent with close-up likeness refs for face and identity lock.
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

              {likenessReferences.length === 0 ? (
                <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  No likeness close-ups are available from the existing likeness reference source, so face lock support is currently unavailable.
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
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">Selected fit refs</p>
                      <p className="mt-2 text-sm leading-6 text-black/70">
                        {selectedFitReferenceIds.length > 0
                          ? fitReferences
                              .filter((reference) => selectedFitReferenceIds.includes(reference.id))
                              .map((reference) => reference.title)
                              .join(" • ")
                          : "No fit refs selected yet."}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">Selected likeness refs</p>
                      <p className="mt-2 text-sm leading-6 text-black/70">
                        {selectedLikenessReferenceIds.length > 0
                          ? likenessReferences
                              .filter((reference) => selectedLikenessReferenceIds.includes(reference.id))
                              .map((reference) => reference.title)
                              .join(" • ")
                          : "No likeness refs selected. Face accuracy may drift."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-black/45">Combined creative summary</p>
                    <p className="mt-2 text-sm leading-6 text-black/70">
                      Fit refs define pose blueprint, body mechanics, movement realism, workout intent, and environment inspiration. Likeness refs define exact facial identity and must dominate eye shape, brows, lips, jawline, age consistency, and hairline fidelity. Keep the same exact woman across all outputs and do not let athletic refs overwrite face accuracy.
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="rounded-3xl border border-black/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/45">Fit References</p>
                    <p className="mt-2 text-sm leading-6 text-black/60">
                      Pulls from `summer_fit`. Use these for pose blueprint, body mechanics, workout intent, movement realism, and environment inspiration. Recommended: 1 to 3.
                    </p>
                  </div>
                  <p className="rounded-full bg-[#f7f4ef] px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/60">
                    {selectedFitReferenceCount}/3 selected
                  </p>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {fitReferences.map((reference) => {
                    const selected = selectedFitReferenceIds.includes(reference.id);

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
                          {reference.description ? (
                            <p className={`text-xs leading-5 ${selected ? "text-white/70" : "text-black/50"}`}>{reference.description}</p>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/45">Likeness References</p>
                    <p className="mt-2 text-sm leading-6 text-black/60">
                      Pulls from the existing close-up likeness source. Use these for face lock, eye shape and color, brows, lips, jawline, age consistency, and hairline identity. Recommended: 1 to 2.
                    </p>
                  </div>
                  <p className="rounded-full bg-[#f7f4ef] px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/60">
                    {selectedLikenessReferenceCount}/2 selected
                  </p>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {likenessReferences.map((reference) => {
                    const selected = selectedLikenessReferenceIds.includes(reference.id);

                    return (
                      <button
                        key={reference.id}
                        type="button"
                        onClick={() => toggleLikenessReference(reference.id)}
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
                            {reference.tags.length > 0 ? reference.tags.join(" • ") : "Likeness anchor"}
                          </p>
                          {reference.description ? (
                            <p className={`text-xs leading-5 ${selected ? "text-white/70" : "text-black/50"}`}>{reference.description}</p>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedLikenessReferenceCount === 0 ? (
                <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  You selected fit refs without likeness refs. Generation can still run, but face accuracy may drift because no dedicated identity-lock closeups are attached.
                </div>
              ) : null}

              {fitGenerateState.error ? (
                <div className="rounded-3xl border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-800">
                  {fitGenerateState.error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={runFitGeneration}
                disabled={fitWorkflowUnavailable || selectedFitReferenceCount < 1 || selectedFitReferenceCount > 3 || selectedLikenessReferenceCount > 2 || fitGenerateState.loading}
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
                          {result.aspectRatio} • {outputModeTitle} • {result.fit_refs_used.length} fit refs • {result.likeness_refs_used.length} likeness refs
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
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">Reference groups used</p>
                      <p className="mt-2"><span className="font-semibold">Fit:</span> {result.fit_refs_used.map((reference) => reference.title).join(" • ") || "None"}</p>
                      <p className="mt-2"><span className="font-semibold">Likeness:</span> {result.likeness_refs_used.map((reference) => reference.title).join(" • ") || "None"}</p>
                      {result.warning ? <p className="mt-3 text-amber-900">{result.warning}</p> : null}
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

        {activeTab === "fit-refine" ? (
          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col gap-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Final Stage</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Refine Final Images</h2>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  Use this finishing bay to polish an existing generated image, enhanced reference output, or uploaded source into a final website-ready asset without inventing a new composition.
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/45">Source image</p>
                    <p className="mt-2 text-sm leading-6 text-black/60">
                      Choose a generated campaign image, an enhanced original output, or upload a local image for controlled final refinement.
                    </p>
                  </div>
                  <label className="rounded-full border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm font-medium text-black/75 transition hover:border-black/25 hover:text-black">
                    Upload local image
                    <input type="file" accept="image/*" className="hidden" onChange={handleRefineUpload} />
                  </label>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {refineSourceOptions.map((source) => {
                    const selected = selectedRefineSourceId === source.id;

                    return (
                      <button
                        key={source.id}
                        type="button"
                        onClick={() => setSelectedRefineSourceId(source.id)}
                        className={`overflow-hidden rounded-[1.5rem] border text-left transition ${selected ? "border-black bg-black text-white" : "border-black/10 bg-[#f7f4ef] text-black"} hover:border-black/25`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={source.previewUrl} alt={source.title} className="h-44 w-full object-cover" />
                        <div className="space-y-2 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">{source.title}</p>
                            <span className="rounded-full border border-current/15 px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
                              {selected ? "Selected" : source.sourceType}
                            </span>
                          </div>
                          <p className={`text-xs leading-5 ${selected ? "text-white/75" : "text-black/55"}`}>{source.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {refineSourceOptions.length === 0 ? (
                  <p className="mt-4 text-sm leading-6 text-black/50">
                    No generated or enhanced sources are loaded yet. Generate, enhance, or upload an image to begin final refinement.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-black/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">Add preset</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <select
                      value={availablePresetToAdd}
                      onChange={(event) => setAvailablePresetToAdd(event.target.value)}
                      className="w-full rounded-2xl border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm text-black outline-none"
                    >
                      {fitManifest?.refinementPresets.map((preset) => (
                        <option key={preset.id} value={preset.id}>
                          {preset.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addPresetToRefinementStack}
                      className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/85"
                    >
                      Add preset
                    </button>
                  </div>
                  {selectedRefinementPresetDefinition ? (
                    <div className="mt-4 rounded-2xl bg-[#f7f4ef] p-4 text-sm leading-6 text-black/70">
                      <p className="font-semibold">{selectedRefinementPresetDefinition.title}</p>
                      <p className="mt-2">{selectedRefinementPresetDefinition.summary}</p>
                      <p className="mt-2 text-black/60">Order guidance: {selectedRefinementPresetDefinition.orderGuidance}</p>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-3xl border border-black/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">Output controls</p>
                  <div className="mt-3 space-y-3 text-sm text-black/70">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={refineKeepOriginalAspectRatio} onChange={() => setRefineKeepOriginalAspectRatio((current) => !current)} />
                      Keep original aspect ratio
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={refineExport4k || selectedRefinementStack.includes("final_4k_upscale")} onChange={() => setRefineExport4k((current) => !current)} />
                      Export 4K if selected
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/45">Refinement stack</p>
                    <p className="mt-2 text-sm leading-6 text-black/60">
                      Build an ordered stack of refinement presets. Cleanup steps usually go first, detail and finish steps go later, and `Final 4K Upscale` usually goes last.
                    </p>
                  </div>
                  <p className="rounded-full bg-[#f7f4ef] px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/60">
                    {selectedRefinementStack.length} steps
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {fitManifest?.refinementRecipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => applyRefinementRecipe(recipe.id)}
                      className="rounded-full border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm font-medium text-black/75 transition hover:border-black/25 hover:text-black"
                    >
                      {recipe.title}
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  {selectedRefinementStackPresets.map((preset, index) => (
                    <div key={`${preset.id}-${index}`} className="rounded-2xl border border-black/10 bg-[#f7f4ef] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-black/45">Step {index + 1}</p>
                          <p className="mt-1 text-lg font-semibold text-black">{preset.title}</p>
                          <p className="mt-2 text-sm leading-6 text-black/70">{preset.summary}</p>
                          <p className="mt-2 text-xs leading-5 text-black/55">{preset.orderGuidance}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => movePresetInStack(index, "up")}
                            disabled={index === 0}
                            className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black/70 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            onClick={() => movePresetInStack(index, "down")}
                            disabled={index === selectedRefinementStackPresets.length - 1}
                            className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black/70 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            onClick={() => removePresetFromStack(index)}
                            className="rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedRefinementStackPresets.length === 0 ? (
                  <p className="mt-4 text-sm leading-6 text-black/50">No presets in the stack yet. Add one or apply a quick recipe.</p>
                ) : null}
              </div>

              {refinementStackWarnings.length > 0 ? (
                <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  <p className="font-semibold">Stack warnings</p>
                  <ul className="mt-2 space-y-2">
                    {refinementStackWarnings.map((warning) => (
                      <li key={warning.id}>- {warning.message}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-3xl bg-[#f7f4ef] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Refinement Recipe Summary</p>
                <p className="mt-3 text-sm leading-6 text-black/70">
                  <span className="font-semibold">Execution order:</span>{" "}
                  {selectedRefinementStackPresets.length > 0
                    ? selectedRefinementStackPresets.map((preset) => preset.title).join(" → ")
                    : "No stack selected"}
                </p>
                <p className="mt-3 text-sm leading-6 text-black/70">
                  <span className="font-semibold">Preserve rules:</span>{" "}
                  {(Object.keys(refinementPreserveFlags) as Array<keyof PreserveFlags>)
                    .filter((flag) => refinementPreserveFlags[flag])
                    .map((flag) => flag.replace(/_/g, " "))
                    .join(" • ") || "None"}
                </p>
                <p className="mt-3 text-sm leading-6 text-black/70">
                  <span className="font-semibold">Camera direction:</span>{" "}
                  {cameraSelectionSummary.primaryAngle.title}
                  {" • "}
                  {cameraSelectionSummary.primaryLens.title}
                  {cameraSelectionSummary.modifiers.length > 0
                    ? ` • ${cameraSelectionSummary.modifiers.map((modifier) => modifier.title).join(" • ")}`
                    : ""}
                  {" • "}
                  {selectedReframeIntensity}
                </p>
                <p className="mt-3 text-sm leading-6 text-black/70">
                  <span className="font-semibold">Final output goals:</span> preserve the same exact woman, preserve the existing shot, keep realism high, and finish the image as a premium website-ready editorial asset.
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">Camera Direction</p>
                  <p className="mt-2 text-sm leading-6 text-black/60">
                    Build one coordinated camera-language direction instead of one-off effects. Combine one main angle and one main lens for best results, then layer compatible modifiers when they add clarity.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {fitManifest?.cameraRecipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => applyCameraRecipe(recipe.id)}
                      className="rounded-full border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm font-medium text-black/75 transition hover:border-black/25 hover:text-black"
                    >
                      {recipe.title}
                    </button>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl border border-black/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-black/45">Reframing</p>
                    <button
                      type="button"
                      aria-expanded={showReframingHelp}
                      aria-label="What reframing means"
                      onClick={() => setShowReframingHelp((current) => !current)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-[#f7f4ef] text-sm font-semibold text-black/70 transition hover:border-black/25 hover:text-black"
                    >
                      ?
                    </button>
                  </div>
                  {showReframingHelp ? (
                    <div className="mt-3 rounded-2xl bg-[#f7f4ef] p-4 text-sm leading-6 text-black/70">
                      <p>
                        Reframing changes how the image feels as if it were shot from a different camera angle, crop, or lens perspective. Subtle reframing keeps the original composition mostly intact. Strong reframing can reinterpret the shot more dramatically while still trying to preserve the same person, pose, and mood.
                      </p>
                      <p className="mt-3">
                        `preserve composition` ON keeps changes subtle. `allow reframing` ON allows a stronger reinterpretation. Angle and lens changes are not just filters — they can affect perspective, crop, and spatial feel.
                      </p>
                      <p className="mt-3 text-black/60">
                        Use reframing when you want the same image to feel more cinematic, closer, wider, lower, more compressed, or more stylized.
                      </p>
                    </div>
                  ) : null}

                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-black/45">Reframe Intensity</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {(["subtle", "moderate", "strong"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedReframeIntensity(value)}
                        className={selectedReframeIntensity === value ? "rounded-full bg-black px-4 py-3 text-sm font-medium text-white" : "rounded-full border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm font-medium text-black/70"}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">Angle / Lens Preview Gallery</p>
                  <p className="mt-2 text-sm leading-6 text-black/60">
                    Select one primary angle and one primary lens. Modifiers like `Close Crop Beauty` and `Dutch Tilt` can be layered when compatible. `Fisheye` is experimental and best used sparingly.
                  </p>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-black/45">Camera angles</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {fitManifest?.cameraAngleOptions.map((option) => {
                          const selected = selectedCameraPresetIds.includes(option.id as CameraDirectionPresetId);

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleCameraPreset(option.id)}
                              className={`rounded-[1.25rem] border p-3 text-left transition ${selected ? "border-black bg-black text-white" : "border-black/10 bg-[#f7f4ef] text-black"}`}
                            >
                              <div className="relative h-32 overflow-hidden rounded-2xl border border-black/10 bg-[#ebe5dc]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={option.previewImageUrl} alt={option.previewAlt} className="h-full w-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                                  {option.previewLabel}
                                </div>
                              </div>
                              <p className="mt-3 text-sm font-semibold">{option.title}</p>
                              <p className={`mt-2 text-xs leading-5 ${selected ? "text-white/75" : "text-black/55"}`}>{option.shortDescription}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-black/45">Lens looks</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {fitManifest?.lensLookOptions.map((option) => {
                          const selected = selectedCameraPresetIds.includes(option.id as CameraDirectionPresetId);

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleCameraPreset(option.id)}
                              className={`rounded-[1.25rem] border p-3 text-left transition ${selected ? "border-black bg-black text-white" : "border-black/10 bg-[#f7f4ef] text-black"}`}
                            >
                              <div className="relative h-32 overflow-hidden rounded-2xl border border-black/10 bg-[#ebe5dc]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={option.previewImageUrl} alt={option.previewAlt} className="h-full w-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                                  {option.previewLabel}
                                </div>
                              </div>
                              <p className="mt-3 text-sm font-semibold">{option.title}</p>
                              <p className={`mt-2 text-xs leading-5 ${selected ? "text-white/75" : "text-black/55"}`}>{option.shortDescription}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl bg-[#f7f4ef] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">Camera Direction Summary</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cameraSelectionSummary.activePresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => toggleCameraPreset(preset.id)}
                        className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black/70 transition hover:border-black/25 hover:text-black"
                      >
                        {preset.title} ×
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-black/70">
                    <span className="font-semibold">Primary angle:</span> {cameraSelectionSummary.primaryAngle.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    <span className="font-semibold">Primary lens:</span> {cameraSelectionSummary.primaryLens.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    <span className="font-semibold">Active modifiers:</span>{" "}
                    {cameraSelectionSummary.modifiers.length > 0
                      ? cameraSelectionSummary.modifiers.map((modifier) => modifier.title).join(" • ")
                      : "None"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    <span className="font-semibold">Reframing intensity:</span> {selectedReframeIntensity}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    <span className="font-semibold">Preserve composition:</span>{" "}
                    {refinementPreserveFlags.preserve_composition ? "ON" : "OFF"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    <span className="font-semibold">Coordinated direction:</span> {cameraSelectionSummary.narrative}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/60">
                    Selecting a new primary angle or lens replaces the previous primary automatically. Incompatible combinations are blocked inline.
                  </p>
                </div>

                {cameraSelectionFeedback ? (
                  <div className="mt-4 rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                    <p className="font-semibold">Selection warning</p>
                    <p className="mt-2">{cameraSelectionFeedback}</p>
                  </div>
                ) : null}

                {cameraDirectionWarnings.length > 0 ? (
                  <div className="mt-4 rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                    <p className="font-semibold">Camera compatibility notes</p>
                    <ul className="mt-2 space-y-2">
                      {cameraDirectionWarnings.map((warning) => (
                        <li key={warning.id}>- {warning.message}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {cameraSelectionSummary.hasNonOriginalSelection ? (
                  <p className="mt-4 text-sm leading-6 text-black/65">
                    A non-original camera direction is active. This may become a controlled reinterpretation instead of pure refinement, especially when `allow reframing` or `allow perspective shift` are enabled.
                  </p>
                ) : null}
              </div>

              <div className="rounded-3xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Preserve Rules</p>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  These stay on by default so the refinement behaves like controlled finishing rather than a new generation pass. `allow reframing` and `allow perspective shift` control how strongly Camera Direction can reinterpret the image.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {(Object.keys(refinementPreserveFlags) as Array<keyof PreserveFlags>).map((flag) => (
                    <label key={flag} className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm text-black/70">
                      <span>{flag.replace(/_/g, " ")}</span>
                      <input type="checkbox" checked={refinementPreserveFlags[flag]} onChange={() => togglePreserveFlag(flag)} />
                    </label>
                  ))}
                </div>
              </div>

              <label className="rounded-3xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Custom instruction</p>
                <textarea
                  value={refinementCustomInstruction}
                  onChange={(event) => setRefinementCustomInstruction(event.target.value)}
                  placeholder="remove tattoos; make her smile slightly; convert to refined black and white; increase pores and sweat detail subtly; remove brand logos from outfit; clean flyaway hairs; keep the same exact face and composition"
                  className="mt-3 min-h-32 w-full rounded-2xl border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm leading-6 text-black outline-none"
                />
              </label>

              <div className="rounded-3xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Recommended Uses</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-black/65">
                  {fitManifest?.refinementHelp.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              {!fitManifest?.storageConfigured ? (
                <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  Blob is not configured, but refinement still works. The refined result will preview in-session as a temporary image and will not be permanently saved yet.
                </div>
              ) : null}

              {fitRefineState.error ? (
                <div className="rounded-3xl border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-800">
                  {fitRefineState.error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={runFinalRefinement}
                disabled={!selectedRefineSource || selectedRefinementStack.length === 0 || fitRefineState.loading}
                className="rounded-full bg-black px-5 py-4 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:bg-black/20"
              >
                {fitRefineState.loading ? "Refining final image…" : "Run final refinement"}
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {fitRefineResults.length === 0 ? (
                <div className="flex min-h-[32rem] items-center justify-center rounded-[2rem] border border-black/10 bg-white p-10 text-center text-sm leading-7 text-black/45 shadow-sm">
                  Choose a source image and run a refinement preset to preview a before/after final polish pass here.
                </div>
              ) : null}

              {fitRefineResults.map((result) => {
                const afterUrl = result.asset?.url || result.imageDataUrl || "";
                const source = refineSourceOptions.find((item) => (item.assetPathname || item.id) === result.metadata.source_image_id) || selectedRefineSource;
                const stackTitle = result.metadata.refinement_stack
                  .map((presetId) => fitManifest?.refinementPresets.find((preset) => preset.id === presetId)?.title || presetId)
                  .join(" → ");

                return (
                  <article key={`${result.metadata.created_at}-${result.metadata.source_image_id}`} className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-black/45">Before / after</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{result.metadata.source_title}</h3>
                        <p className="mt-2 text-sm text-black/60">{stackTitle} • {result.metadata.output_size}</p>
                      </div>
                      {result.decision ? (
                        <span className="rounded-full bg-[#f7f4ef] px-3 py-2 text-xs uppercase tracking-[0.2em] text-black/65">{result.decision}</span>
                      ) : null}
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#ebe5dc]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={source?.previewUrl || ""} alt={`${result.metadata.source_title} before`} className="h-full w-full object-cover" />
                        <div className="border-t border-black/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-black/45">Before</div>
                      </div>
                      <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#ebe5dc]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={afterUrl} alt={`${result.metadata.source_title} after`} className="h-full w-full object-cover" />
                        <div className="border-t border-black/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-black/45">After</div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {afterUrl ? (
                        <a
                          href={result.asset?.downloadUrl || result.asset?.url || afterUrl}
                          download
                          target={result.asset ? "_blank" : undefined}
                          rel={result.asset ? "noreferrer" : undefined}
                          className="rounded-full border border-black/10 bg-[#f7f4ef] px-4 py-3 text-sm font-medium text-black/75 transition hover:border-black/25 hover:text-black"
                        >
                          Download
                        </a>
                      ) : null}
                      {result.asset?.pathname ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRefineDecision(result, "approve")}
                            className="rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/85"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRefineDecision(result, "reject")}
                            className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                    </div>

                    <div className="mt-4 rounded-3xl bg-[#f7f4ef] p-4 text-sm leading-6 text-black/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">Refinement metadata</p>
                      <p className="mt-2"><span className="font-semibold">Source:</span> {result.metadata.source_type}</p>
                      <p className="mt-2"><span className="font-semibold">Stack:</span> {stackTitle}</p>
                      <p className="mt-2"><span className="font-semibold">Camera:</span> {result.metadata.camera_angle} • {result.metadata.lens_look} • {result.metadata.reframe_intensity}</p>
                      <p className="mt-2"><span className="font-semibold">Modifiers:</span> {result.metadata.camera_modifiers.join(" • ") || "None"}</p>
                      <p className="mt-2"><span className="font-semibold">Direction summary:</span> {result.metadata.camera_direction_narrative}</p>
                      <p className="mt-2"><span className="font-semibold">Custom instruction:</span> {result.metadata.custom_instruction_text || "None"}</p>
                      <p className="mt-2"><span className="font-semibold">Output size:</span> {result.metadata.output_size}</p>
                      <p className="mt-2"><span className="font-semibold">Created:</span> {new Date(result.metadata.created_at).toLocaleString()}</p>
                      {result.stackWarnings && result.stackWarnings.length > 0 ? (
                        <p className="mt-2"><span className="font-semibold">Warnings:</span> {result.stackWarnings.map((warning) => warning.message).join(" • ")}</p>
                      ) : null}
                      {result.warning ? <p className="mt-3 text-amber-900">{result.warning}</p> : null}
                      {result.responseText ? <p className="mt-3">{result.responseText}</p> : null}
                    </div>
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
