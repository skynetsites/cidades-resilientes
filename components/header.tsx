"use client";

import { useEffect, useState } from "react";
import { User, LogOut, Moon, Sun, Menu, X } from "lucide-react";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Nav } from "./nav";
import { Logo } from "./logo";
import Link from "next/link";

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function Header({ isDarkMode, toggleTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { lang, setLang, t } = useLanguage();

  // Persistência de login
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  function getFirstAndSecondName(
    displayName: string | null | undefined,
    email: string | null | undefined
  ) {
    if (!displayName) return email?.split("@")[0] || "Usuário";

    const parts = displayName.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return email?.split("@")[0] || "Usuário";
    if (parts.length === 1) return parts[0]; // Apenas primeiro nome
    return `${parts[0]} ${parts[1]}`; // Primeiro e segundo nome
  }
/*
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error(error);
    }
  };
*/

const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);

    // Scroll até a seção comunidade após login
    setTimeout(() => {
      document.getElementById("comunidade")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  } catch (error) {
    console.error(error);
  }
};

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  function Languages({ className = "" }: { className?: string }) {
    return (
      <div className={`${className} flex items-center gap-2`}>
        {["pt", "en", "es"].map((l) => (
          <span
            key={l}
            onClick={() => setLang(l as "pt" | "en" | "es")}
            className={`cursor-pointer ${
              lang === l ? "font-bold underline" : ""
            }`}
          >
            {l.toUpperCase()}
          </span>
        ))}
      </div>
    );
  }

  function Actios({
    className = "",
    icon = false,
  }: {
    className?: string;
    icon?: boolean;
  }) {
    return (
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center gap-2">
            <span className={`${className}`}>
              {t("ola")},&nbsp;<Link href="/dashboard">{getFirstAndSecondName(user.displayName, user.email)}</Link>
            </span>
            {!icon && (
            <span className="text-sm">|</span>
            )}
            <a
              onClick={() => { 
                handleLogout();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="flex gap-2 cursor-pointer text-white"
            >
              {icon ? (
                <LogOut className="h-6 w-6 text-emerald-500" />
              ) : (
                t("logout")
              )}
            </a>
          </div>
        ) : (
          <a
            onClick={() => { 
              handleLogin();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="flex gap-2 cursor-pointer text-white"
          >
            {icon ? (
              <User className="h-6 w-6 text-emerald-500" />
            ) : (
              t("login")
            )}
          </a>
        )}
      </div>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Nav className="flex font-bold space-x-8" />
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Actios className="hidden md:inline-flex" icon={true} />

          {/* Dark Mode */}
          <a
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </a>

          {/* Language switch */}
          <Languages className="hidden md:inline-flex" />

          {/* Mobile Menu */}
          <a
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden cursor-pointer"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </a>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden p-4 border-t border-border flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            {/* Language switch */}
            <Languages />

            {/* Actions */}

            <Actios />
          </div>
          <Nav 
            className="space-y-3"
            closeMenu={() => setIsMenuOpen(false)} 
          />
        </nav>
      )}
    </header>
  );
}
