import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <button
      className={`p-2 rounded-full ${
        isDarkMode ? "bg-gray-700" : "bg-gray-200"
      }`}
      onClick={onToggle}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
