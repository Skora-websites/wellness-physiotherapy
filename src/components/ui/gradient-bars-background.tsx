import React from "react";

export interface GradientBarsProps {
  numBars?: number;
  gradientFrom?: string;
  gradientTo?: string;
  animationDuration?: number;
  className?: string;
}

export const GradientBars: React.FC<GradientBarsProps> = ({
  numBars = 15,
  gradientFrom = "rgb(21, 90, 145)",
  gradientTo = "transparent",
  animationDuration = 2,
  className = "",
}) => {
  const calculateHeight = (index: number, total: number) => {
    const position = index / (total - 1);
    const maxHeight = 100;
    const minHeight = 30;

    const center = 0.5;
    const distanceFromCenter = Math.abs(position - center);
    const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);

    return minHeight + (maxHeight - minHeight) * heightPercentage;
  };

  return (
    <>
      <style>{`
        @keyframes pulseBar {
          0% { transform: scaleY(var(--initial-scale)); }
          100% { transform: scaleY(calc(var(--initial-scale) * 0.7)); }
        }
      `}</style>

      <div
        className={`gradient-bars-bg ${className}`}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          {Array.from({ length: numBars }).map((_, index) => {
            const height = calculateHeight(index, numBars);
            return (
              <div
                key={index}
                style={{
                  flex: `1 0 calc(100% / ${numBars})`,
                  maxWidth: `calc(100% / ${numBars})`,
                  height: "100%",
                  background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
                  transform: `scaleY(${height / 100})`,
                  transformOrigin: "bottom",
                  transition: "transform 0.5s ease-in-out",
                  animation: `pulseBar ${animationDuration}s ease-in-out infinite alternate`,
                  animationDelay: `${index * 0.1}s`,
                  outline: "1px solid rgba(0, 0, 0, 0)",
                  boxSizing: "border-box",
                  // @ts-ignore
                  "--initial-scale": height / 100,
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export interface ComponentProps {
  numBars?: number;
  gradientFrom?: string;
  gradientTo?: string;
  animationDuration?: number;
  backgroundColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function Component({
  numBars = 15,
  gradientFrom = "rgb(21, 90, 145)",
  gradientTo = "transparent",
  animationDuration = 2,
  backgroundColor = "#061929",
  className = "",
  children,
}: ComponentProps) {
  return (
    <section
      className={`relative w-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor,
      }}
    >
      <GradientBars
        numBars={numBars}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        animationDuration={animationDuration}
      />

      {children && (
        <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100%" }}>
          {children}
        </div>
      )}
    </section>
  );
}

export { Component };
