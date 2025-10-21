"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, Lightbulb, Award } from "lucide-react"

export function ImpactSection() {
  const metrics = [
    {
      icon: Users,
      value: "12,847",
      label: "Participantes Ativos",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: MapPin,
      value: "156",
      label: "Cidades Participantes",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Lightbulb,
      value: "2,341",
      label: "Ideias Compartilhadas",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Award,
      value: "89",
      label: "Projetos Implementados",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  const achievements = [
    {
      title: "Redução de 15% nas emissões",
      description: "Projetos implementados resultaram em redução significativa de CO₂",
      location: "São Paulo, Brasil",
    },
    {
      title: "Primeira ciclovia solar",
      description: "Implementação pioneira de ciclovia com painéis solares integrados",
      location: "Amsterdam, Holanda",
    },
    {
      title: "Jardins verticais urbanos",
      description: "50 prédios públicos receberam jardins verticais para reduzir temperatura",
      location: "Singapura",
    },
    {
      title: "App de qualidade do ar",
      description: "Aplicativo desenvolvido pela comunidade monitora ar em tempo real",
      location: "Barcelona, Espanha",
    },
  ]

  return (
    <section id="impacto" className="py-35 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Impacto Coletivo</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Juntos, estamos criando mudanças reais. Veja o impacto que nossa comunidade global está gerando em cidades
              ao redor do mundo.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {metrics.map((metric, index) => (
              <Card
                key={index}
                className={`${metric.bgColor} border-2 border-transparent hover:border-current transition-colors group`}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`${metric.color} ${metric.bgColor} p-3 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <metric.icon className="h-8 w-8" />
                  </div>
                  <div className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
                  <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Conquistas da Comunidade</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3 leading-relaxed">{achievement.description}</p>
                    <div className="flex items-center text-sm text-emerald-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {achievement.location}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Seja parte desta transformação</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Cada participante fortalece nosso movimento. Juntos, podemos criar um futuro mais sustentável e
                  resiliente para todas as cidades.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => document.getElementById("campanha")?.scrollIntoView({ behavior: "smooth" })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Participar Agora
                  </button>
                  <button
                    onClick={() => document.getElementById("comunidade")?.scrollIntoView({ behavior: "smooth" })}
                    className="border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Ver Comunidade
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
