"use client";

import React, { useEffect, useState } from "react";
import { CutCornerContainer } from "./CutCornerContainer";
import clsx from "clsx";

interface StatBadgeProps {
  prefix?: string;
  value: number | string;
  suffix?: string;
  description: string;
  className?: string;
  bg?: string; // e.g. "bg-sage-1" or "bg-white"
  cornerBg?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  prefix = "",
  value,
  suffix = "",
  description,
  className = "",
  bg = "bg-sage-1",
  cornerBg = "bg-white",
}) => {
  const [displayNum, setDisplayNum] = useState(0);
  const numValue = typeof value === "number" ? value : parseInt(value.toString().replace(/[^0-9]/g, ""), 10);

  useEffect(() => {
    if (isNaN(numValue)) return;
    let start = 0;
    const duration = 1200;
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = numValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numValue) {
        setDisplayNum(numValue);
        clearInterval(timer);
      } else {
        setDisplayNum(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [numValue]);

  return (
    <CutCornerContainer
      cornerSizeDesktop={9}
      cornerSizeMobile={7}
      cornerBg={cornerBg}
      className={clsx(
        "inline-flex items-center gap-x-3 p-3.5 pl-4 max-lg:w-full md:max-w-[22.625rem] border border-black/5 shadow-sm",
        bg,
        className
      )}
    >
      <div className="text-20px-stat font-display font-semibold text-black shrink-0 tracking-tight flex items-baseline">
        <span>{prefix}</span>
        <span>{isNaN(numValue) ? value : displayNum}</span>
        <span>{suffix}</span>
      </div>
      <p className="text-11px-stat-description text-black/80 font-normal leading-tight">
        {description}
      </p>
    </CutCornerContainer>
  );
};
