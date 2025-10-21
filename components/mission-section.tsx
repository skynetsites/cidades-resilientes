"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TreePine, Thermometer, Droplets, Wind } from "lucide-react"

export function MissionSection() {
  return (
    <section id="missao" className="py-35 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                As cidades, lar da maioria da população mundial, são ao mesmo tempo as maiores emissoras de carbono e as
                mais vulneráveis aos impactos climáticos.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Nossa missão não é apenas reagir a desastres, mas construir comunidades engajadas que resistam, se
                adaptem e prosperem frente às mudanças do clima.
              </p>

              {/* Impact Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card/50 border-emerald-500/20">
                  <CardContent className="p-4 text-center">
                    <Thermometer className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Ilhas de Calor</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Inundações</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-gray-500/20">
                  <CardContent className="p-4 text-center">
                    <Wind className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Poluição</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-emerald-500/20">
                  <CardContent className="p-4 text-center">
                    <TreePine className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Falta de Verde</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* City Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-8">
                <img
                  src="/background.webp"
                  alt="Cidade Inteligente e Sustentável"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-full shadow-lg">
                <TreePine className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg">
                <Droplets className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
