
import { useTheme } from "@/hooks/use-theme";

export const useThemeString = () => {
  const { theme } = useTheme();
  return theme;
};
