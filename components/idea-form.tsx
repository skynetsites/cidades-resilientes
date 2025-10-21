import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function IdeaForm({ user, onSubmit }: { user: any; onSubmit: (idea: any) => void }) {
  const [newIdea, setNewIdea] = useState({ city: "", idea: "" });
  const topRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔎 Validação extra no React
    const cityRegex = /^[^,]+,\s*[^,]+$/;
    if (!cityRegex.test(newIdea.city)) {
      alert("Por favor, insira no formato: Cidade, País");
      return;
    }

    if (newIdea.idea.trim().length < 10) {
      alert("A ideia deve ter pelo menos 10 caracteres.");
      return;
    }

    // Se passou nas validações, envia
    onSubmit(newIdea);

    // Reseta o formulário
    setNewIdea({ city: "", idea: "" });

    // Sempre volta para a página 1 e sobe até o título
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div ref={topRef}></div>

      {/* Campo de Cidade */}
      <Input
        placeholder="Cidade, País"
        value={newIdea.city}
        onChange={(e) => setNewIdea({ ...newIdea, city: e.target.value })}
        required
        disabled={!user}
        pattern="^[^,]+,\s*[^,]+$"
        title="Digite no formato: Cidade, País"
      />

      {/* Campo de Descrição da Ideia */}
      <Textarea
        placeholder={
          !user
            ? "Faça login para adicionar ideias"
            : "Descreva sua ideia..."
        }
        value={newIdea.idea}
        onChange={(e) => setNewIdea({ ...newIdea, idea: e.target.value })}
        required
        rows={3}
        disabled={!user}
        minLength={10}
        title="A ideia deve ter pelo menos 10 caracteres"
      />

      {/* Botão */}
      <Button type="submit" disabled={!user}>
        {user ? "Compartilhar" : "Faça login para compartilhar"}
      </Button>
    </form>
  );
}
