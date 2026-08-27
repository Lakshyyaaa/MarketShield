import React from "react";
import clsx from "clsx";

interface CutCornerContainerProps {
  children: React.ReactNode;
  className?: string;
  cornerSizeDesktop?: number; // default 17px
  cornerSizeMobile?: number;  // default 13px or 1px
  cornerBg?: string;          // background color for the cut corners (usually white or sage)
  style?: React.CSSProperties;
}

export const CutCornerContainer: React.FC<CutCornerContainerProps> = ({
  children,
  className = "",
  cornerSizeDesktop = 17,
  cornerSizeMobile = 13,
  cornerBg = "bg-white",
  style = {},
}) => {
  return (
    <div
      className={clsx("relative", className)}
      style={
        {
          "--corner-size-desktop": `${cornerSizeDesktop}px`,
          "--corner-size-mobile": `${cornerSizeMobile}px`,
          ...style,
        } as React.CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0 z-10 m-0 overflow-hidden" aria-hidden="true">
        {/* Top Left */}
        <div
          className={clsx("cut-corner cut-corner-tl", cornerBg)}
          style={{ width: "var(--corner-size-desktop)", height: "var(--corner-size-desktop)" }}
        />
        {/* Top Right */}
        <div
          className={clsx("cut-corner cut-corner-tr", cornerBg)}
          style={{ width: "var(--corner-size-desktop)", height: "var(--corner-size-desktop)" }}
        />
        {/* Bottom Left */}
        <div
          className={clsx("cut-corner cut-corner-bl", cornerBg)}
          style={{ width: "var(--corner-size-desktop)", height: "var(--corner-size-desktop)" }}
        />
        {/* Bottom Right */}
        <div
          className={clsx("cut-corner cut-corner-br", cornerBg)}
          style={{ width: "var(--corner-size-desktop)", height: "var(--corner-size-desktop)" }}
        />
      </div>
      {children}
    </div>
  );
};
