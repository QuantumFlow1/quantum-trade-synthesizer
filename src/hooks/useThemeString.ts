
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function useThemeString() {
  const { theme, resolvedTheme } = useTheme();
  const [themeString, setThemeString] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setThemeString((theme || resolvedTheme || 'dark') as 'light' | 'dark');
  }, [theme, resolvedTheme]);

  return themeString;
}
