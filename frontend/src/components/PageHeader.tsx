import React from "react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-5 sm:pb-8 border-b transition-colors ${
        onDark ? "border-hairline-dark text-on-primary" : "border-hairline-light text-ink"
      }`}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.03, ease: "easeOut" }}
            className={`text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.72px] uppercase mb-1.5 sm:mb-2 block select-none ${
              onDark ? "text-shade-40" : "text-shade-50"
            }`}
          >
            {eyebrow}
          </motion.span>
        )}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
          <motion.h1
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, delay: 0.06, ease: [0.23, 1, 0.32, 1] }}
            className={`font-display text-2xl sm:text-4xl md:text-[44px] font-[330] tracking-[-0.02em] leading-[1.15] sm:leading-[1.12] text-balance ${
              onDark ? "text-white" : "text-ink"
            }`}
          >
            {title}
          </motion.h1>
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.24, delay: 0.08 }}
            >
              {badge}
            </motion.div>
          )}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.1, ease: "easeOut" }}
          className={`text-[15px] sm:text-[16px] font-sans mt-3 text-pretty leading-relaxed ${
            onDark ? "text-shade-30" : "text-shade-60"
          }`}
        >
          {description}
        </motion.p>
      </div>
      {action && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.24, delay: 0.12 }}
          className="self-start md:self-auto shrink-0"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};
