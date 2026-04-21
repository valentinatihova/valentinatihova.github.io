import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagToggle }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35 }}
      className="flex flex-wrap gap-3 mb-8"
    >
      <button
        onClick={() => onTagToggle('all')}
        className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-mono font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 ${
          selectedTags.length === 0
            ? 'border-accent/60 bg-stone-900 text-accent shadow-[0_0_0_1px_rgba(206,127,70,0.25)]'
            : 'border-stone-700/80 bg-stone-950/80 text-stone-300 hover:border-stone-600 hover:bg-stone-900 hover:text-stone-100'
        }`}
      >
        All Articles
      </button>
      
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-mono font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 ${
              isSelected
                ? 'border-accent/60 bg-stone-900 text-accent shadow-[0_0_0_1px_rgba(206,127,70,0.25)]'
                : 'border-stone-700/80 bg-stone-950/80 text-stone-300 hover:border-stone-600 hover:bg-stone-900 hover:text-stone-100'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </motion.div>
  );
};
