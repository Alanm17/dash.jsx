import { useAppContext } from "./AppContext";

export const useThemeClasses = () => {
  const { isDarkMode } = useAppContext();

  return {
    bgMain: isDarkMode ? "bg-gray-800" : "bg-gray-50",
    bgCard: isDarkMode ? "bg-gray-700" : "bg-white",
    textColor: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    borderColor: isDarkMode ? "border-gray-600" : "border-gray-200",
    hoverBg: isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-50",
  };
};
