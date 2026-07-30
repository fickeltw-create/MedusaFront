import { memo } from 'react';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  count?: number;
};

const SectionTitle = memo(function SectionTitle({ title, subtitle, count }: SectionTitleProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Modura Store</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
        </div>
        {typeof count === 'number' && (
          <p className="text-sm text-slate-500">{count} {count === 1 ? 'product' : 'products'}</p>
        )}
      </div>
      {subtitle ? <p className="max-w-2xl text-sm text-slate-600 sm:text-base">{subtitle}</p> : null}
    </div>
  );
});

export default SectionTitle;
