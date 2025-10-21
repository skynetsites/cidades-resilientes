"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "pt" | "en" | "es";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof translations.pt) => string;
}

const translations = {
  pt: {
    // Geral
    cidades: "Cidades",
    resilientes: "Resilientes",
    inicio: "Início",
    missao: "Missão",
    conscientizacao: "Conscientização",
    campanha: "Campanha",
    comunidade: "Comunidade",
    impacto: "Impacto",
    login: "Entrar com Google",
    logout: "Sair",
    ola: "Olá",
    
    // Hero
    titleHero: "Movimento Global",
    subTituloHero: `Transformando cidades em espaços mais <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">inteligentes</span>, sustentáveis e resilientes`,
    descricaoHero: "Um movimento global de conscientização e engajamento social para construir comunidades que resistam, se adaptem e prosperem frente às mudanças climáticas.",
    buttonHero1: "Participe Agora",
    buttonHero2: "Saiba Mais",
  },
  en: {
    // Geral
    cidades: "Cities",
    resilientes: "resilient",
    inicio: "Home",
    missao: "Mission",
    conscientizacao: "Awareness",
    campanha: "Campaign",
    comunidade: "Community",
    impacto: "Impact",
    login: "Sign in with Google",
    logout: "Logout",
    ola: "Hello",
    
    // Hero
    titleHero: "Global Movement",
    subTituloHero: `Transforming cities into more <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">intelligent</span>, sustainable and resilient`,
    descricaoHero: "A global movement for awareness and social engagement to build communities that resist, adapt, and thrive in the face of climate change.",
    buttonHero1: "Join Now",
    buttonHero2: "Learn More",
  },
  es: {
    // Geral
    cidades: "Ciudades",
    resilientes: "resiliente",
    inicio: "Comenzar",
    missao: "Misión",
    conscientizacao: "Concienciación",
    campanha: "Campaña",
    comunidade: "Comunidad",
    impacto: "Impacto",
    login: "Iniciar con Google",
    logout: "Salir",
    ola: "Hola",
    
    // Hero
    titleHero: "Movimento Global",
    subTituloHero: `Transformando ciudades en espacios más <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">inteligentes</span>, sostenibles y resilientes`,
    descricaoHero: "Un movimiento global de concienciación y compromiso social para construir comunidades que resistan, se adapten y prosperen frente al cambio climático.",
    buttonHero1: "Únete Ahora",
    buttonHero2: "Más Información",
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  setLang: () => {},
  t: (key) => translations.pt[key]
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("pt");

  const t = (key: keyof typeof translations.pt) => translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
