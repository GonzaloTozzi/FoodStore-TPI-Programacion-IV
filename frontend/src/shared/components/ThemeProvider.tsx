
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useThemeStore } from "@/store/themeStore";

interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const darkMode = useThemeStore((state) => state.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [darkMode]);

  return <>{children}</>;
}

export default ThemeProvider;
