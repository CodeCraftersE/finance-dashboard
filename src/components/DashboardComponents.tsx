import React from 'react';
import { cn } from '../lib/utils';

// Card wrapper
export const InfoCard = ({ children, className, title, desc, highlightColor }: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  desc?: string;
  highlightColor?: string;
}) => {
  return (
    <div className={cn(
      "bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 relative overflow-hidden transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-lg duration-200",
      className
    )}>
      {/* Accent strip */}
      {highlightColor && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1.5" 
          style={{ backgroundColor: highlightColor }} 
        />
      )}
      
      {(title || desc) && (
        <div className="mb-5 ml-1">
          {title && <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>}
          {desc && <p className="text-xs text-zinc-400 font-medium tracking-tight">{desc}</p>}
        </div>
      )}
      
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};

// Label Badge
export const Label = ({ text, mood = 'neutral' }: { text: string; mood?: 'neutral' | 'positive' | 'negative' | 'blue' }) => {
  const flavor = {
    neutral: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    positive: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    negative: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
    blue: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
  };
  
  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase", flavor[mood])}>
      {text}
    </span>
  );
};
