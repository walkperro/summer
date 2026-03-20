export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#1d1b18]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-12 md:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-black/45">Summer / Image Direction</p>
        <div className="max-w-4xl space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Gemini review flow for the upgraded editorial prompt pack.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-black/65 md:text-lg">
            Generate first-pass review images with the upgraded cinematic prompt language and the reference
            attachments listed in the prompt pack, then decide what deserves a final 4K finishing pass.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            className="inline-flex items-center justify-center rounded-full bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-black/85"
            href="/review"
          >
            Open review wall
          </a>
        </div>

        <div className="grid gap-4 rounded-[2rem] border border-black/10 bg-white p-6 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Step 1</p>
            <p className="mt-2 text-lg font-semibold">Generate review-first</p>
            <p className="mt-2 text-sm leading-6 text-black/65">Use the upgraded prompts and reference images to get composition and likeness right.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Step 2</p>
            <p className="mt-2 text-lg font-semibold">Approve or reject</p>
            <p className="mt-2 text-sm leading-6 text-black/65">Review each image on a clean page before investing in any upscale or final pass.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">Step 3</p>
            <p className="mt-2 text-lg font-semibold">Finish in 4K</p>
            <p className="mt-2 text-sm leading-6 text-black/65">Only upscale approved finalists so quality effort goes into the right images.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
