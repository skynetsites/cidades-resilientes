"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Heart, Target } from "lucide-react";

export function CampaignSection() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cidade: "",
    mensagem: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // loading

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // inicia loading

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ nome: "", email: "", cidade: "", mensagem: "" });
        }, 3000);
      } else {
        alert("Erro ao enviar a inscrição. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar a inscrição. Tente novamente.");
    } finally {
      setIsLoading(false); // finaliza loading
    }
  };

  return (
    <section id="campanha" className="py-35 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Participe da Campanha
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Junte-se ao movimento global por cidades mais inteligentes, sustentáveis e resilientes. Sua participação faz a diferença!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">
                  Inscreva-se Agora
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-foreground mb-2">
                        Nome
                      </label>
                      <Input
                        id="nome"
                        name="nome"
                        type="text"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          E-mail
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="cidade" className="block text-sm font-medium text-foreground mb-2">
                          Cidade
                        </label>
                        <Input
                          id="cidade"
                          name="cidade"
                          type="text"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          placeholder="Sua cidade"
                          required
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mensagem" className="block text-sm font-medium text-foreground mb-2">
                        Mensagem
                      </label>
                      <Textarea
                        id="mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                        placeholder="Compartilhe suas ideias para tornar sua cidade mais sustentável..."
                        rows={4}
                        className="w-full resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg flex justify-center items-center gap-2"
                      disabled={isLoading} // desabilita botão enquanto envia
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                          Enviando...
                        </>
                      ) : (
                        "Participar do Movimento"
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">Obrigado por participar!</h3>
                    <p className="text-muted-foreground">
                      Sua inscrição foi recebida com sucesso. Juntos, vamos transformar nossas cidades!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground mb-6">Por que participar?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Faça parte da comunidade</h4>
                    <p className="text-muted-foreground">
                      Conecte-se com pessoas que compartilham da mesma visão de futuro sustentável.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <Target className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Impacto real</h4>
                    <p className="text-muted-foreground">
                      Suas ideias e ações contribuem diretamente para soluções concretas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500/10 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Construa o futuro</h4>
                    <p className="text-muted-foreground">
                      Ajude a criar cidades mais resilientes para as próximas gerações.
                    </p>
                  </div>
                </div>

                {/* Call to Action */}
              <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
                <CardContent className="p-6 text-center">
                  <h4 className="text-lg font-bold text-foreground mb-2">Transformação começa com você</h4>
                  <p className="text-muted-foreground text-sm">
                    Cada participante fortalece nosso movimento global por cidades mais inteligentes e sustentáveis.
                  </p>
                </CardContent>
              </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
