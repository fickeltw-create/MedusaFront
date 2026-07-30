import { memo } from 'react';

type SortOption = {
  value: string;
  label: string;
};

type SortSelectorProps = {
  options: SortOption[];
  selectedValue: string;
  onChange: (value: string) => void;
};

const SortSelector = memo(function SortSelector({ options, selectedValue, onChange }: SortSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">Sort</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition ${selectedValue === option.value ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
          >
            <span>{option.label}</span>
            {selectedValue === option.value ? <span className="text-xs font-semibold">✓</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
});

export default SortSelector;
