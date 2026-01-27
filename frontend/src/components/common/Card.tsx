import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ children, padding = "md", className, ...props }: CardProps) {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={clsx(
        "bg-gray-800 rounded-xl border border-gray-700",
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
