export function AdminPage({
  title,
  description,
  result,
  children,
}: {
  title: string;
  description: string;
  result?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="border border-black/8 bg-white/70 px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#7a6f67]">Summer Loffler Admin</p>
        <h1 className="font-editorial mt-4 text-4xl leading-none tracking-[-0.03em] sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#5f5650]">{description}</p>
        {result ? <p className="mt-4 text-sm text-[#3c6b46]">Saved: {result}</p> : null}
      </div>
      {children}
    </div>
  );
}
