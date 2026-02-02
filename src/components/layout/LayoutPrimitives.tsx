import React from "react";
import { cn } from "@/lib/utils";

// -- Page Container --
// Enforces max-width and centering.
// Default: 1200-1400px (max-w-7xl approx 1280px, max-w-screen-xl approx 1280px)
interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "default" | "narrow" | "wide";
}

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
    ({ className, size = "default", children, ...props }, ref) => {
        const maxWidthClass = {
            default: "max-w-7xl", // ~1280px
            narrow: "max-w-4xl",  // ~896px (Focused tasks)
            wide: "max-w-[1600px]", // Dashboards
        }[size];

        return (
            <div
                ref={ref}
                className={cn(
                    "w-full mx-auto px-4 sm:px-6 lg:px-8", // Responsive horizontal padding
                    maxWidthClass,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
PageContainer.displayName = "PageContainer";

// -- Section --
// Enforces vertical spacing using the spacing scale.
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    spacing?: "none" | "sm" | "default" | "lg" | "xl";
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, spacing = "default", children, ...props }, ref) => {
        const spacingClass = {
            none: "",
            sm: "py-8",
            default: "py-16 md:py-24", // Standard section gap
            lg: "py-24 md:py-32",      // Major divisions
            xl: "py-32 md:py-48",      // Hero transitions
        }[spacing];

        return (
            <section
                ref={ref}
                className={cn("w-full relative", spacingClass, className)}
                {...props}
            >
                {children}
            </section>
        );
    }
);
Section.displayName = "Section";

// -- Grid --
// Standard 12-column grid.
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: 1 | 2 | 3 | 4 | 6 | 12;
    gap?: "sm" | "default" | "lg";
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ className, cols = 12, gap = "default", children, ...props }, ref) => {
        // Tailwind strict classes for columns usually need to be explicit or regex'd.
        // We'll map them for safety.
        const colsClass = {
            1: "grid-cols-1",
            2: "grid-cols-1 md:grid-cols-2",
            3: "grid-cols-1 md:grid-cols-3",
            4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
            6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
            12: "grid-cols-4 md:grid-cols-6 lg:grid-cols-12",
        }[cols];

        const gapClass = {
            sm: "gap-4",
            default: "gap-8", // 32px
            lg: "gap-12",
        }[gap];

        return (
            <div
                ref={ref}
                className={cn("grid", colsClass, gapClass, className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Grid.displayName = "Grid";

// -- Stack --
// Flex wrapper for vertical/horizontal alignment.
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: "row" | "col";
    gap?: "xs" | "sm" | "md" | "lg" | "xl";
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between";
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
    ({ className, direction = "col", gap = "md", align = "stretch", justify = "start", children, ...props }, ref) => {
        const gapClass = {
            xs: "gap-2", // 8px
            sm: "gap-4", // 16px
            md: "gap-6", // 24px
            lg: "gap-8", // 32px
            xl: "gap-12", // 48px
        }[gap];

        const alignClass = {
            start: "items-start",
            center: "items-center",
            end: "items-end",
            stretch: "items-stretch",
        }[align];

        const justifyClass = {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between"
        }[justify];

        return (
            <div
                ref={ref}
                className={cn(
                    "flex",
                    direction === "col" ? "flex-col" : "flex-row",
                    gapClass,
                    alignClass,
                    justifyClass,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Stack.displayName = "Stack";
