"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  
  const { t } = useLanguage();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
  

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-[url('/vision.webp')] bg-cover bg-center"></div>
      </div>

      {/* City Illustration */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <img
          src="/world.webp"
          alt="Cidade Inteligente"
          className="w-96 h-64 object-contain opacity-80"
        />
      </div>

      <div className="container mx-auto px-5 py-35 pb-25 relative z-10">
        <div className="max-w-6xl mx-auto text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <Sparkles className="h-8 w-8 text-emerald-400 mr-2" />
            <span className="text-emerald-400 text-xl md:text-2xl lg:text-3xl font-medium">{t("titleHero")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none" dangerouslySetInnerHTML={{ __html: t("subTituloHero") }} />

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
            {t("descricaoHero")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              onClick={() => scrollToSection("campanha")}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg cursor-pointer"
            >
              {t("buttonHero1")}
            </Button>
            <Button
              onClick={() => scrollToSection("missao")}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg cursor-pointer"
            >
              {t("buttonHero2")}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-white/60" />
      </div>
    </section>
  )
}
