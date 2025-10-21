"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Globe, Leaf } from "lucide-react"

export function AwarenessSection() {
  const awarenessItems = [
    {
      icon: BarChart3,
      title: "Dados e estatísticas mundiais",
      description: "Informações precisas sobre o impacto climático das cidades e soluções baseadas em evidências.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Globe,
      title: "Movimento social global",
      description: "Uma rede mundial de cidadãos engajados trabalhando juntos por cidades mais resilientes.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: Leaf,
      title: "Soluções sustentáveis",
      description: "Práticas inovadoras e tecnologias verdes para transformar nossos espaços urbanos.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ]

  return (
    <section id="conscientizacao" className="relative py-35 bg-muted/30">
      <div hidden className="absolute inset-0 bg-gradient-to-t from-[rgba(0,178,169,0.3)] to-[rgba(0,178,169,0.2)] " data-astro-cid-kuvmo4ou=""></div>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Conscientização Global</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transformar nossas cidades requer conhecimento, colaboração e ação coletiva. Juntos, podemos criar um
              futuro mais sustentável e resiliente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {awarenessItems.map((item, index) => (
              <Card
                key={index}
                className={`${item.bgColor} ${item.borderColor} border-2 hover:scale-105 transition-transform duration-300 cursor-pointer group`}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`${item.color} mx-auto mb-4 p-4 rounded-full bg-background/50 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="h-12 w-12" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistics Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-500 mb-2">70%</div>
              <p className="text-sm text-muted-foreground">da população mundial vive em cidades</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">75%</div>
              <p className="text-sm text-muted-foreground">das emissões de CO₂ vêm das cidades</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">90%</div>
              <p className="text-sm text-muted-foreground">das cidades costeiras estão em risco</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">2050</div>
              <p className="text-sm text-muted-foreground">ano meta para neutralidade carbônica</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
