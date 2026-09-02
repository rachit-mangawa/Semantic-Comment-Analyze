import React from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  badge,
  action,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-hairline">
      <div>
        {eyebrow && (
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-muted mb-2 block select-none">
            {eyebrow}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-ink tracking-tight leading-tight">
            {title}
          </h1>
          {badge}
        </div>
        <p className="text-[15px] sm:text-[16px] font-sans text-body mt-2 max-w-2xl text-pretty leading-relaxed">
          {description}
        </p>
      </div>
      {action && <div className="self-start md:self-auto shrink-0">{action}</div>}
    </div>
  );
};
