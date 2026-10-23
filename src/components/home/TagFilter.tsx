import React from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagToggle }) => {

  return (
    <div
      className="flex flex-wrap gap-2 mb-8"
    >
      <button
        aria-pressed={selectedTags.length === 0}
        onClick={() => onTagToggle('all')}
        className={`cursor-pointer border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
          selectedTags.length === 0
            ? 'border-stone-900 bg-stone-900 text-white'
            : 'border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-900'
        }`}
      >
        All
      </button>

      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            aria-pressed={isSelected}
            onClick={() => onTagToggle(tag)}
            className={`cursor-pointer border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
              isSelected
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-900'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};
