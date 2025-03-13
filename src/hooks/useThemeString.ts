
import { useThemeDetection } from "@/hooks/use-theme-detection";

export const useThemeString = () => {
  const { theme } = useThemeDetection();
  return theme;
};
