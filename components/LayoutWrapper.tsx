// app/components/LayoutWrapper.tsx
"use client";
import { useState, useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <LanguageProvider>
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}>
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
