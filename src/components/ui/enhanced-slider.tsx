import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface BenchmarkMarker {
  value: number;
  label: string;
}

interface EnhancedSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  benchmarks?: BenchmarkMarker[];
  colorZones?: {
    green?: [number, number];
    yellow?: [number, number];
    red?: [number, number];
  };
  formatValue?: (value: number) => string;
}

const EnhancedSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  EnhancedSliderProps
>(({ 
  className, 
  showValue = true, 
  valuePrefix = "", 
  valueSuffix = "",
  benchmarks,
  colorZones,
  formatValue,
  ...props 
}, ref) => {
  const value = props.value?.[0] ?? props.defaultValue?.[0] ?? 0;
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const range = max - min;
  const percentage = ((value - min) / range) * 100;

  const getZoneColor = (val: number) => {
    if (!colorZones) return "bg-primary";
    if (colorZones.green && val >= colorZones.green[0] && val <= colorZones.green[1]) {
      return "bg-emerald-500";
    }
    if (colorZones.yellow && val >= colorZones.yellow[0] && val <= colorZones.yellow[1]) {
      return "bg-amber-500";
    }
    if (colorZones.red && val >= colorZones.red[0] && val <= colorZones.red[1]) {
      return "bg-red-500";
    }
    return "bg-primary";
  };

  const displayValue = formatValue 
    ? formatValue(value) 
    : `${valuePrefix}${value}${valueSuffix}`;

  return (
    <div className="relative pt-6 pb-2">
      {/* Floating value indicator */}
      {showValue && (
        <div 
          className="absolute -top-1 transform -translate-x-1/2 transition-all duration-150 ease-out z-10"
          style={{ left: `${percentage}%` }}
        >
          <div className={cn(
            "px-2 py-1 rounded-md text-xs font-semibold text-white shadow-lg",
            getZoneColor(value)
          )}>
            {displayValue}
          </div>
          <div 
            className={cn(
              "w-2 h-2 rotate-45 -mt-1 mx-auto",
              getZoneColor(value)
            )}
          />
        </div>
      )}

      {/* Benchmark markers */}
      {benchmarks && benchmarks.length > 0 && (
        <div className="absolute inset-x-0 top-6 pointer-events-none">
          {benchmarks.map((benchmark, i) => {
            const pos = ((benchmark.value - min) / range) * 100;
            return (
              <div
                key={i}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${pos}%` }}
              >
                <div className="w-0.5 h-2 bg-muted-foreground/40 mx-auto" />
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {benchmark.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          {/* Color zone background */}
          {colorZones && (
            <div className="absolute inset-0 flex">
              {colorZones.green && (
                <div 
                  className="h-full bg-emerald-100 dark:bg-emerald-950/30"
                  style={{ 
                    marginLeft: `${((colorZones.green[0] - min) / range) * 100}%`,
                    width: `${((colorZones.green[1] - colorZones.green[0]) / range) * 100}%` 
                  }}
                />
              )}
            </div>
          )}
          <SliderPrimitive.Range className={cn("absolute h-full", getZoneColor(value))} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={cn(
          "block h-5 w-5 rounded-full border-2 bg-background ring-offset-background transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "hover:scale-110 active:scale-95",
          getZoneColor(value).replace("bg-", "border-")
        )} />
      </SliderPrimitive.Root>
    </div>
  );
});

EnhancedSlider.displayName = "EnhancedSlider";

export { EnhancedSlider };
