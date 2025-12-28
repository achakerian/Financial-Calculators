import React from 'react';

interface InfoSectionHeaderProps {
  title: string;
  years: string[];
  year: string;
  onYearChange: (year: string) => void;
  showTitle?: boolean;
}

export const InfoSectionHeader: React.FC<InfoSectionHeaderProps> = ({
  title,
  years,
  year,
  onYearChange,
  showTitle = true,
}) => {
  return (
    <div className={`mb-2 flex items-center ${showTitle ? 'justify-between' : 'justify-end'} gap-3`}>
      {showTitle && (
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      )}
      <label className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-dark-muted">
        <span>Financial year</span>
        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="rounded-2xl border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 [color-scheme:light] dark:[color-scheme:dark]"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
