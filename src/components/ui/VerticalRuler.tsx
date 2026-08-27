import React from "react";

interface VerticalRulerProps {
  color?: string; // e.g. "bg-black" or "bg-forest"
}

export const VerticalRuler: React.FC<VerticalRulerProps> = ({ color = "bg-black/35" }) => {
  // Generate tick marks (1 wide tick, 4 narrow ticks)
  const ticks = Array.from({ length: 45 });

  return (
    <>
      {/* Left Ruler */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 flex w-4.5 flex-col space-y-7 overflow-y-clip left-0 max-lg:hidden z-20"
        aria-hidden="true"
      >
        {ticks.map((_, i) => (
          <React.Fragment key={`left-${i}`}>
            <div className={`h-px shrink-0 w-4.5 ${color}`} />
            <div className={`h-px shrink-0 w-2.5 ${color}`} />
            <div className={`h-px shrink-0 w-2.5 ${color}`} />
            <div className={`h-px shrink-0 w-2.5 ${color}`} />
            <div className={`h-px shrink-0 w-2.5 ${color}`} />
          </React.Fragment>
        ))}
      </div>

      {/* Right Ruler */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 flex w-4.5 flex-col space-y-7 overflow-y-clip right-0 items-end max-lg:hidden z-20"
        aria-hidden="true"
      >
        {ticks.map((_, i) => (
          <React.Fragment key={`right-${i}`}>
            <div className={`h-px shrink-0 w-4.5 ${color}`} />
            <div className={`h-px shrink-0 w-2.5 ${color}`} />
            <div className={`h-px shrink-0 w-2.5 ${color}`} />
            <div className={`h-px shrink-0 w-2.5 ${color}`} />
            <div className={`h-px shrink-0 w-2.5 ${color}`} />
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export const CenterStickyChevrons: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[48%] -translate-y-1/2 z-30 flex justify-between px-0 max-lg:hidden">
      {/* Left Arrow pointing right */}
      <div className="w-5 text-forest left-0 transition-transform duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 22 16" fill="none">
          <path
            d="M2.0326 15.6442L0 13.5799L0 2.0643L2.0326 0L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {/* Right Arrow pointing left */}
      <div className="w-5 rotate-180 text-forest right-0 transition-transform duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 22 16" fill="none">
          <path
            d="M2.0326 15.6442L0 13.5799L0 2.0643L2.0326 0L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};
