import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "forest" | "lemongrass" | "whiteWithGrayBorder" | "whiteBorder" | "gray" | "textLink";
  size?: "small" | "medium" | "large";
  href?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "forest",
  size = "medium",
  href,
  onClick,
  className = "",
  target,
}) => {
  const isLink = !!href;

  const sizeClasses = {
    small: "min-h-[2.25rem] px-3.5 py-2 text-[0.875rem]",
    medium: "min-h-[2.6875rem] px-4.5 py-2.5 text-[0.9375rem]",
    large: "min-h-[3rem] px-6 py-3 text-[1rem]",
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "forest":
        return {
          textColor: "text-lemongrass",
          bgClass: "bg-forest group-hover:bg-forest/90",
          borderClass: "",
        };
      case "lemongrass":
        return {
          textColor: "text-forest font-semibold",
          bgClass: "bg-lemongrass group-hover:bg-[#c2f785]",
          borderClass: "",
        };
      case "whiteWithGrayBorder":
        return {
          textColor: "text-black group-hover:text-black",
          bgClass: "bg-white border border-black/15 group-hover:bg-lemongrass group-hover:border-lemongrass",
          borderClass: "",
        };
      case "whiteBorder":
        return {
          textColor: "text-white group-hover:text-black",
          bgClass: "bg-transparent border border-white/25 group-hover:bg-white group-hover:border-white",
          borderClass: "",
        };
      case "gray":
        return {
          textColor: "text-black",
          bgClass: "bg-black/5 group-hover:bg-black/8",
          borderClass: "",
        };
      case "textLink":
        return {
          textColor: "text-forest hover:text-moss",
          bgClass: "",
          borderClass: "",
        };
    }
  };

  if (variant === "textLink") {
    const Component = isLink ? "a" : "button";
    return (
      <Component
        href={href}
        onClick={onClick}
        target={target}
        className={clsx(
          "inline-flex items-center gap-x-2 text-15px-btn text-forest hover:text-moss transition-colors group cursor-pointer font-medium",
          className
        )}
      >
        <span className="relative mt-0.5 inline-block h-2 w-2.5 shrink-0 transition-transform group-hover:translate-x-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 22 16" fill="none">
            <path
              d="M2.0326 15.6442L0 13.5799L0 2.0643L2.0326 0L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span>{children}</span>
      </Component>
    );
  }

  const { textColor, bgClass } = getVariantStyles();

  const content = (
    <div
      className={clsx(
        "group relative inline-flex appearance-none items-center justify-center select-none cursor-pointer",
        textColor,
        sizeClasses[size],
        className
      )}
    >
      <span
        className={clsx(
          "absolute inset-0 rounded-md transition-all duration-200 origin-center group-hover:scale-[0.98]",
          bgClass
        )}
      />
      <span className="text-15px-btn relative z-10 font-medium tracking-tight flex items-center gap-2">
        {children}
      </span>
    </div>
  );

  if (isLink) {
    return (
      <a href={href} target={target} className="inline-block">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block">
      {content}
    </button>
  );
};
