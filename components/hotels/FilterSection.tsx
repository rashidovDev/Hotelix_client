import { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

export default function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}
