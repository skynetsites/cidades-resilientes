"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Lightbulb, HelpCircle, ChevronDown, ChevronUp, Heart, User, Trash2 } from "lucide-react"

export function CommunitySection() {
  const [activeTab, setActiveTab] = useState("ideias")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [openCommentModal, setOpenCommentModal] = useState<{ open: boolean, ideaId?: number, parentId?: number }>({ open: false })

  type Idea = {
    id: number
    author: string
    city: string
    idea: string
    likes: number
    time: string
    comments?: Comment[]
  }

  type Comment = {
    id: number
    author: string
    text: string
    time: string
    replies?: Comment[]
  }

  type NewIdea = Omit<Idea, "id" | "likes" | "time">

  const [newIdea, setNewIdea] = useState<NewIdea>({
    author: "",
    city: "",
    idea: "",
  })

  const [ideas, setIdeas] = useState<Idea[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("ideas")
    const defaultIdeas: Idea[] = [
      {
        id: 1,
        author: "Maria Silva",
        city: "São Paulo",
        idea: "Implementar jardins verticais em prédios públicos para reduzir a temperatura urbana.",
        likes: 24,
        time: "2 horas atrás",
      },
      {
        id: 2,
        author: "João Santos",
        city: "Rio de Janeiro",
        idea: "Criar ciclovias conectadas com estações de bike-sharing alimentadas por energia solar.",
        likes: 18,
        time: "5 horas atrás",
      },
      {
        id: 3,
        author: "Ana Costa",
        city: "Belo Horizonte",
        idea: "Desenvolver aplicativo para monitoramento da qualidade do ar em tempo real.",
        likes: 31,
        time: "1 dia atrás",
      },
    ]

    if (saved) {
      const parsed: Idea[] = JSON.parse(saved)
      setIdeas(parsed.length === 0 ? defaultIdeas : parsed)
    } else {
      setIdeas(defaultIdeas)
    }
  }, [])

  useEffect(() => {
    if (ideas.length > 0) {
      localStorage.setItem("ideas", JSON.stringify(ideas))
    }
  }, [ideas])

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault()
    if (newIdea.author && newIdea.city && newIdea.idea) {
      const newIdeaObj: Idea = {
        id: ideas.length + 1,
        ...newIdea,
        likes: 0,
        time: "Agora",
      }
      setIdeas([newIdeaObj, ...ideas])
      setNewIdea({ author: "", city: "", idea: "" })
      setCurrentPage(1) // volta para a primeira página
    }
  }

  const handleLike = (id: number) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, likes: i.likes + 1 } : i))
  }

  const handleRemoveIdea = (id: number) => {
    const updatedIdeas = ideas.filter(idea => idea.id !== id)
    setIdeas(updatedIdeas)
    localStorage.setItem("ideas", JSON.stringify(updatedIdeas))
    if (currentPage > Math.ceil(updatedIdeas.length / ideasPerPage)) {
      setCurrentPage(prev => prev - 1) // ajusta página se remover última ideia
    }
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const [commentInputs, setCommentInputs] = useState({ author: "", text: "" })

  const handleSubmitCommentModal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInputs.author || !commentInputs.text || !openCommentModal.ideaId) return

    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) => {
        if (idea.id !== openCommentModal.ideaId) return idea

        const newComment: Comment = {
          id: Date.now(),
          author: commentInputs.author,
          text: commentInputs.text,
          time: "Agora",
        }

        if (openCommentModal.parentId) {
          const addReply = (comments: Comment[] = []): Comment[] =>
            comments.map(c =>
              c.id === openCommentModal.parentId
                ? { ...c, replies: [...(c.replies || []), newComment] }
                : c
            )
          return { ...idea, comments: addReply(idea.comments) }
        } else {
          return { ...idea, comments: [...(idea.comments || []), newComment] }
        }
      })
    )

    setCommentInputs({ author: "", text: "" })
    setOpenCommentModal({ open: false })
  }

  const faqs: { question: string; answer: string }[] = [
    {
      question: "Como posso contribuir para tornar minha cidade mais sustentável?",
      answer: "Existem várias formas: participe de iniciativas locais, adote práticas sustentáveis no dia a dia, compartilhe ideias na nossa plataforma e engaje sua comunidade em projetos ambientais.",
    },
    {
      question: "O que são cidades inteligentes?",
      answer: "Cidades inteligentes usam tecnologia e dados para melhorar a qualidade de vida dos cidadãos, otimizar recursos, reduzir impactos ambientais e criar soluções inovadoras para desafios urbanos.",
    },
    {
      question: "Como o movimento global funciona?",
      answer: "Conectamos pessoas, organizações e governos ao redor do mundo para compartilhar conhecimento, recursos e melhores práticas em sustentabilidade urbana.",
    },
    {
      question: "Posso implementar as ideias da plataforma na minha cidade?",
      answer: "Sim! Todas as ideias compartilhadas são de domínio público. Encorajamos a adaptação e implementação das soluções em diferentes contextos urbanos.",
    },
  ]

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const ideasPerPage = 5
  const totalPages = Math.ceil(ideas.length / ideasPerPage)
  const indexOfLastIdea = currentPage * ideasPerPage
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage
  const currentIdeas = ideas.slice(indexOfFirstIdea, indexOfLastIdea)

  // Ref título
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [scrollOnPageChange, setScrollOnPageChange] = useState(false)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
      setScrollOnPageChange(true)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
      setScrollOnPageChange(true)
    }
  }

  useEffect(() => {
    if (scrollOnPageChange && titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "smooth" })
      setScrollOnPageChange(false)
    }
  }, [currentPage, scrollOnPageChange])

  return (
    <section id="comunidade" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Comunidade & Interação
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Conecte-se, compartilhe ideias e construa soluções colaborativas para transformar nossas cidades em espaços mais inteligentes e resilientes.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-background rounded-lg p-1 border border-border">
              <Button variant={activeTab === "ideias" ? "default" : "ghost"} onClick={() => setActiveTab("ideias")} className="px-6 py-2">
                <Lightbulb className="h-4 w-4 mr-2" /> Mural de Ideias
              </Button>
              <Button variant={activeTab === "faq" ? "default" : "ghost"} onClick={() => setActiveTab("faq")} className="px-6 py-2">
                <HelpCircle className="h-4 w-4 mr-2" /> Perguntas Frequentes
              </Button>
            </div>
          </div>

          {/* Ideas Wall */}
          {activeTab === "ideias" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Submit New Idea */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-border sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <MessageSquare className="h-5 w-5 mr-2" /> Compartilhe sua Ideia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitIdea} className="space-y-4">
                      <Input placeholder="Seu nome" value={newIdea.author} onChange={(e) => setNewIdea({ ...newIdea, author: e.target.value })} required />
                      <Input placeholder="Sua cidade" value={newIdea.city} onChange={(e) => setNewIdea({ ...newIdea, city: e.target.value })} required />
                      <Textarea placeholder="Descreva sua ideia..." value={newIdea.idea} onChange={(e) => setNewIdea({ ...newIdea, idea: e.target.value })} rows={3} required />
                      <Button type="submit" className="w-full">Compartilhar Ideia</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Ideas List */}
              <div className="lg:col-span-2 space-y-6">
                {currentIdeas.map((idea) => (
                  <Card key={idea.id} className="bg-card border-border hover:shadow-lg transition-shadow relative">
  {/* Botão Remover no topo direito */}
  <Button
    onClick={() => handleRemoveIdea(idea.id)}
    variant="ghost"
    size="sm"
    className="absolute point bottom-2 right-2 p-1"
    title="Remover ideia"
  >
    <Trash2 className="h-4 w-4 text-red-500" />
  </Button>

  <CardContent className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-500/10 p-2 rounded-full"><User className="h-4 w-4 text-emerald-500" /></div>
        <div>
          <p className="font-semibold text-foreground">{idea.author}</p>
          <p className="text-sm text-muted-foreground">{idea.city}</p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{idea.time}</span>
    </div>

    <p className="text-foreground mb-4 leading-relaxed">{idea.idea}</p>

    <div className="flex items-center justify-between">
   <Button
  onClick={() => handleLike(idea.id)}
  variant="ghost"
  size="sm"
  className="flex items-center"
>
  <Heart
    className="h-4 w-4 mr-1"
    color={idea.likes > 0 ? "red" : "white"} // cor condicional
  />
  {idea.likes}
</Button>
      <Button onClick={() => setOpenCommentModal({ open: true, ideaId: idea.id })} variant="ghost" size="sm">
        <MessageSquare className="h-4 w-4 mr-1" />Comentar
      </Button>
    </div>

    {/* Comentários */}
    <div className="mt-4">
      {idea.comments?.map(c => (
        <div key={c.id} className="ml-0 border-b border-muted/20 py-1">
          <p><span className="font-semibold">{c.author}:</span> {c.text} <span className="text-xs text-muted-foreground">({c.time})</span></p>
          {c.replies?.map(r => (
            <div key={r.id} className="ml-4 border-l border-muted/30 pl-2">
              <p><span className="font-semibold">{r.author}:</span> {r.text} <span className="text-xs text-muted-foreground">({r.time})</span></p>
            </div>
          ))}
          <Button size="sm" variant="ghost" onClick={() => setOpenCommentModal({ open: true, ideaId: idea.id, parentId: c.id })}>Responder</Button>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
                ))}

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-4 mt-4">
                    <Button onClick={goToPrevPage} disabled={currentPage === 1}>Anterior</Button>
                    <span className="px-2 py-1 bg-muted/30 rounded">{currentPage} / {totalPages}</span>
                    <Button onClick={goToNextPage} disabled={currentPage === totalPages}>Próximo</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === "faq" && (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="p-0">
                      <button onClick={() => toggleFaq(index)} className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                        <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                        {expandedFaq === index ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                      </button>
                      {expandedFaq === index && <div className="px-6 pb-6"><p className="text-muted-foreground leading-relaxed">{faq.answer}</p></div>}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">Não encontrou sua resposta?</h3>
                  <p className="text-muted-foreground mb-4">Entre em contato conosco e nossa equipe terá prazer em ajudar.</p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700"><MessageSquare className="h-4 w-4 mr-2" />Fale Conosco</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Modal Comentário */}
          {openCommentModal.open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg w-96">
                <h3 className="text-lg font-bold mb-4">Adicionar Comentário</h3>
                <form onSubmit={handleSubmitCommentModal} className="space-y-3">
                  <Input placeholder="Seu nome" value={commentInputs.author} onChange={(e) => setCommentInputs({ ...commentInputs, author: e.target.value })} required />
                  <Textarea placeholder="Digite seu comentário..." value={commentInputs.text} onChange={(e) => setCommentInputs({ ...commentInputs, text: e.target.value })} required rows={3} />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" onClick={() => setOpenCommentModal({ open: false })}>Cancelar</Button>
                    <Button type="submit">Enviar</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
