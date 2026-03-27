export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-black/8 bg-[#fbf7f2] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.04)] ${className}`}>{children}</div>;
}
