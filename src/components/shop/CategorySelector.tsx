import { memo } from 'react';

type CategorySelectorProps = {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
};

const CategorySelector = memo(function CategorySelector({
  categories,
  selectedCategories,
  onToggleCategory,
}: CategorySelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Categories</h3>
        <span className="text-xs text-slate-500">{categories.length} available</span>
      </div>
      <div className="space-y-2">
        {categories.map((category) => {
          const checked = selectedCategories.includes(category);
          return (
            <label
              key={category}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleCategory(category)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>{category}</span>
              </span>
              {checked ? <span className="text-xs font-medium text-sky-600">Selected</span> : null}
            </label>
          );
        })}
      </div>
    </div>
  );
});

export default CategorySelector;
