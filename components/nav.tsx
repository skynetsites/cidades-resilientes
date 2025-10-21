"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavProps {
  className?: string;
  closeMenu?: () => void;
}

export function Nav({ className = "", closeMenu }: NavProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  // Quando voltar para "/", checa se tem seção salva e faz scroll
  useEffect(() => {
    if (pathname === "/") {
      const target = sessionStorage.getItem("scrollTarget");
      if (target) {
        sessionStorage.removeItem("scrollTarget");
        requestAnimationFrame(() => {
          const el = document.getElementById(target);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveSection(target);
          }
        });
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const sections = [
        "inicio",
        "missao",
        "conscientizacao",
        "campanha",
        "comunidade",
        "impacto",
      ];
      let current = "inicio";
      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 100) {
          current = section;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const sections: Array<
    "inicio" | "missao" | "conscientizacao" | "campanha" | "comunidade" | "impacto"
  > = ["inicio", "missao", "conscientizacao", "campanha", "comunidade", "impacto"];

  const handleClick = async (section: string) => {
    closeMenu?.();

    if (pathname !== "/") {
      // Salva qual seção deve scrollar
      sessionStorage.setItem("scrollTarget", section);
      await router.push("/"); // navega sem hash
    } else {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(section);
      }
    }
  };

  return (
    <ul className={className}>
      {sections.map((section) => (
        <li key={section}>
          <a
            onClick={() => handleClick(section)}
            className={`transition-colors cursor-pointer ${
              pathname === "/" && activeSection === section
                ? "text-emerald-400"
                : "text-slate-300 hover:text-emerald-400"
            }`}
          >
            {t(section as keyof typeof t)}
          </a>
        </li>
      ))}
    </ul>
  );
}
