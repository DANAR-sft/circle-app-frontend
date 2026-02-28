import { Sun, Moon } from "lucide-react";
import type { MouseEvent } from "react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        toggleTheme();
      }}
      aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
      className={`p-0 inline-flex items-center justify-center w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors ${className ?? ""}`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
