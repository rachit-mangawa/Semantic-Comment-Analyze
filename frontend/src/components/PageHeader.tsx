import React from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  onDark?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  badge,
  action,
  onDark = false,
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b transition-colors ${
        onDark ? "border-hairline-dark text-on-primary" : "border-hairline-light text-ink"
      }`}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <span
            className={`text-[12px] font-sans font-medium tracking-[0.72px] uppercase mb-2.5 block select-none ${
              onDark ? "text-shade-40" : "text-shade-50"
            }`}
          >
            {eyebrow}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-3.5">
          <h1
            className={`font-display text-3xl sm:text-4xl md:text-[44px] font-[330] tracking-[-0.015em] leading-[1.14] text-balance ${
              onDark ? "text-white" : "text-ink"
            }`}
          >
            {title}
          </h1>
          {badge}
        </div>
        <p
          className={`text-[15px] sm:text-[16px] font-sans mt-3 text-pretty leading-relaxed ${
            onDark ? "text-shade-30" : "text-shade-60"
          }`}
        >
          {description}
        </p>
      </div>
      {action && <div className="self-start md:self-auto shrink-0">{action}</div>}
    </div>
  );
};
