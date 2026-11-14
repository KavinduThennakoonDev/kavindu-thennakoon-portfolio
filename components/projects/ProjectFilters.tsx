"use client";

import type { ReactNode } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortKey = "updated" | "created" | "name" | "stars";

export const sortLabels: Record<SortKey, string> = {
  updated: "Recently updated",
  created: "Recently created",
  name: "Name (A–Z)",
  stars: "Most stars",
};

interface ProjectFiltersProps {
  query: string;
  onQuery: (value: string) => void;
  categories: string[];
  category: string;
  onCategory: (value: string) => void;
  technologies: string[];
  technology: string;
  onTechnology: (value: string) => void;
  sort: SortKey;
  onSort: (value: SortKey) => void;
  resultCount: number;
  onReset: () => void;
  dirty: boolean;
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="relative block min-w-0 flex-1 sm:flex-none">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full cursor-pointer appearance-none rounded-full border border-line-strong bg-bg-2 pl-4 pr-10 text-sm text-fg transition-colors hover:border-fg/30 focus:border-accent-2 focus:outline-none sm:w-auto"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </label>
  );
}

export function ProjectFilters(props: ProjectFiltersProps) {
  const {
    query,
    onQuery,
    categories,
    category,
    onCategory,
    technologies,
    technology,
    onTechnology,
    sort,
    onSort,
    resultCount,
    onReset,
    dirty,
  } = props;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search by name, description or technology…"
            className="h-11 w-full rounded-full border border-line-strong bg-bg-2 pl-11 pr-4 text-sm text-fg placeholder:text-subtle transition-colors hover:border-fg/30 focus:border-accent-2 focus:outline-none"
          />
        </label>
        <div className="flex gap-3">
          <Select label="Filter by technology" value={technology} onChange={onTechnology}>
            <option value="all">All technologies</option>
            {technologies.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select label="Sort projects" value={sort} onChange={(v) => onSort(v as SortKey)}>
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {sortLabels[key]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
        {["all", ...categories].map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => onCategory(c)}
              className={cn(
                "h-9 rounded-full border px-4 text-[13px] transition-[color,background-color,border-color] duration-300",
                active
                  ? "border-fg bg-fg text-bg"
                  : "border-line-strong text-muted hover:border-fg/40 hover:text-fg",
              )}
            >
              {c === "all" ? "All" : c}
            </button>
          );
        })}
        <span className="ml-auto flex items-center gap-3 text-xs text-subtle" aria-live="polite">
          {resultCount} {resultCount === 1 ? "project" : "projects"}
          {dirty && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-muted underline-offset-4 hover:text-fg hover:underline"
            >
              <X className="size-3" aria-hidden />
              Clear filters
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
