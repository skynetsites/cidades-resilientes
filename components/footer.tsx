"use client"

import { Button } from "@/components/ui/button"
import { Building2, Leaf, Facebook, Instagram, Linkedin, Twitter, ArrowUp, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext";
import { Logo } from "./logo";
import { Nav } from "./nav";

export function Footer() {
  const { t } = useLanguage();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
             <Logo />
              <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-6">
                Construindo juntos cidades mais inteligentes, sustentáveis e resilientes para um futuro melhor.
              </p>

              {/* Social Media */}
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Navegação</h3>
              <Nav className="space-y-2" />
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-white mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">
                    Sobre a Campanha
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">
                    Guia de Sustentabilidade
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">
                    Relatórios de Impacto
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">
                    Políticas de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  <span className="text-slate-300 text-sm">contato@cidadesresilientess.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span className="text-slate-300 text-sm">+55 (11) 9999-9999</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className="text-slate-300 text-sm">São Paulo, Brasil</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-6">
                <p className="text-sm text-slate-300 mb-2">Receba atualizações:</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    className="bg-slate-800 border border-slate-700 rounded-l-lg px-3 py-2 text-sm text-white placeholder-slate-400 flex-1 focus:outline-none focus:border-emerald-400"
                  />
                  <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-l-none px-4">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-slate-400 text-sm">
                  © 2025 Movimento Cidades Resilientes. Todos os direitos reservados.
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Construindo juntos um futuro mais sustentável e resiliente.
                </p>
              </div>

              {/* Back to Top Button */}
              <Button
                onClick={scrollToTop}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 bg-transparent"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Voltar ao Topo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
