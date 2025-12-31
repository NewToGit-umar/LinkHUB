import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

// Theme presets with aesthetic dark gradients
export const themePresets = {
  emerald: {
    name: "Emerald Night",
    primary: "#10b981",
    secondary: "#059669",
    bg: "from-gray-950 via-emerald-950 to-gray-950",
    accent: "emerald",
    isDark: true,
  },
  ocean: {
    name: "Ocean Depth",
    primary: "#0ea5e9",
    secondary: "#0284c7",
    bg: "from-gray-950 via-cyan-950 to-gray-950",
    accent: "cyan",
    isDark: true,
  },
  purple: {
    name: "Royal Purple",
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    bg: "from-gray-950 via-purple-950 to-gray-950",
    accent: "purple",
    isDark: true,
  },
  rose: {
    name: "Rose Gold",
    primary: "#f43f5e",
    secondary: "#e11d48",
    bg: "from-gray-950 via-rose-950 to-gray-950",
    accent: "rose",
    isDark: true,
  },
  light: {
    name: "Clean Light",
    primary: "#6366f1",
    secondary: "#4f46e5",
    bg: "from-slate-50 via-blue-50 to-indigo-100",
    accent: "indigo",
    isDark: false,
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("linkhub_theme");
    if (saved && themePresets[saved]) return saved;
    return "emerald"; // Default to aesthetic dark theme
  });

  useEffect(() => {
    localStorage.setItem("linkhub_theme", theme);
    const preset = themePresets[theme];

    // Apply theme to document
    if (preset?.isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Set CSS variables for dynamic theming
    document.documentElement.style.setProperty(
      "--primary-color",
      preset?.primary || "#10b981"
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      preset?.secondary || "#059669"
    );
  }, [theme]);

  const toggleTheme = () => {
    const themes = Object.keys(themePresets);
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const currentPreset = themePresets[theme] || themePresets.emerald;

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: currentPreset.isDark,
    preset: theme, // The key name for comparison
    presets: themePresets,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeContext;
