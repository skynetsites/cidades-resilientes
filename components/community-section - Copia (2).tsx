"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Lightbulb, HelpCircle, ChevronDown, ChevronUp, Heart, User, Trash2 } from "lucide-react"
import { auth, provider } from "@/lib/firebase"
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"
import Image from "next/image"

type Comment = {
  id: number
  author: string
  text: string
  time: string
  replies?: Comment[]
}

type Idea = {
  id: number
  author: string
  email: string
  photoURL?: string
  city: string
  idea: string
  likes: number
  time: string
  comments?: Comment[]
}

type NewIdea = Omit<Idea, "id" | "likes" | "time" | "author" | "email">

export function CommunitySection() {
  const topRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("ideias")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [openCommentModal, setOpenCommentModal] = useState<{ open: boolean; ideaId?: number; parentId?: number }>({ open: false })
  const [user, setUser] = useState<any>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [newIdea, setNewIdea] = useState<NewIdea>({ city: "", idea: "" })
  //const [currentPage, setCurrentPage] = useState(1)
  //const ideasPerPage = 5
  const [commentInputs, setCommentInputs] = useState({ author: "", text: "" })

  // 🔹 Exemplo de ideias fixas
  const exampleIdeas: Idea[] = [
    { id: 1, author: "Maria Silva", email: "maria@email.com", city: "São Paulo", idea: "Implementar jardins verticais em prédios públicos.", likes: 24, time: "2 horas atrás", comments: [{id:1,author:"Carlos",text:"Excelente ideia!",time:"1h"}] },
    { id: 2, author: "João Santos", email: "joao@email.com", city: "Rio de Janeiro", idea: "Criar ciclovias conectadas com estações de bike-sharing.", likes: 18, time: "5 horas atrás", comments: [] },
    { id: 3, author: "Ana Costa", email: "ana@email.com", city: "Belo Horizonte", idea: "Desenvolver app para monitoramento da qualidade do ar.", likes: 31, time: "1 dia atrás", comments: [] },
  ]

  // 🔹 Persistência de login
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
  }, [])

  // 🔹 Carrega ideias do localStorage + exemplo
  useEffect(() => {
    const saved = localStorage.getItem("userIdeas")
    const userIdeas: Idea[] = saved ? JSON.parse(saved) : []

    // Evita conflito de IDs
    const maxExampleId = Math.max(...exampleIdeas.map(i => i.id))
    const userIdeasWithIds = userIdeas.map((idea, idx) => ({ ...idea, id: maxExampleId + idx + 1 }))

    //setIdeas([...exampleIdeas, ...userIdeasWithIds])
    const combinedIdeas = [...userIdeas, ...exampleIdeas]
  setIdeas(combinedIdeas)
  }, [])

  // 🔹 Salva apenas ideias do usuário
  useEffect(() => {
    if (!user) return
    const userIdeas = ideas.filter(i => i.email === user.email)
    localStorage.setItem("userIdeas", JSON.stringify(userIdeas))
  }, [ideas, user])

  

  // 🔹 Submissão de ideia
  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newIdea.city || !newIdea.idea) return

    const newIdeaObj: Idea = {
      id: ideas.length + 1,
      author: user.displayName,
      email: user.email, 
      photoURL: user.photoURL,
      city: newIdea.city,
      idea: newIdea.idea,
      likes: 0,
      time: "Agora",
    }

    setIdeas([newIdeaObj, ...ideas])
    setNewIdea({ city: "", idea: "" })
    setCurrentPage(1) // volta para a primeira página
  }

  // 🔹 Likes
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

 const toggleFaq = (index: number) => setExpandedFaq(expandedFaq === index ? null : index)

  
  
  const handleSubmitCommentModal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInputs.author || !commentInputs.text || !openCommentModal.ideaId) return

    setIdeas(prev =>
      prev.map(idea => {
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

  const faqs = [
    { question: "Como posso contribuir para tornar minha cidade mais sustentável?", answer: "Participe de iniciativas locais, compartilhe ideias e engaje sua comunidade." },
    { question: "O que são cidades inteligentes?", answer: "Cidades inteligentes usam tecnologia e dados para melhorar a vida dos cidadãos." },
    { question: "Como o movimento global funciona?", answer: "Conectamos pessoas e organizações para compartilhar conhecimento e práticas urbanas." },
    { question: "Posso implementar as ideias da plataforma na minha cidade?", answer: "Sim! Todas as ideias são públicas e adaptáveis a diferentes contextos." },
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
      <div ref={topRef} className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-foreground mb-6">Comunidade & Interação</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Conecte-se, compartilhe ideias e construa soluções colaborativas para transformar nossas cidades.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-background rounded-lg p-1 border border-border">
              <Button variant={activeTab === "ideias" ? "default" : "ghost"} onClick={() => setActiveTab("ideias")}>Mural de Ideias</Button>
              <Button variant={activeTab === "faq" ? "default" : "ghost"} onClick={() => setActiveTab("faq")}>Perguntas Frequentes</Button>
            </div>
          </div>

          {/* Ideas Tab */}
          {activeTab === "ideias" && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="bg-card border-border sticky top-24">
                  <CardHeader>
                    <CardTitle>Compartilhe sua Ideia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitIdea} className="space-y-4">
                      <Input placeholder="Cidade" value={newIdea.city} onChange={(e) => setNewIdea({...newIdea, city: e.target.value})} required disabled={!user} />
                      <Textarea placeholder={!user ? "Faça login para adicionar ideias" : "Descreva sua ideia..."} value={newIdea.idea} onChange={(e) => setNewIdea({...newIdea, idea: e.target.value})} required rows={3} disabled={!user} />
                      <Button type="submit" disabled={!user}>
                        {user ? "Compartilhar" : "Faça login para compartilhar"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {currentIdeas.map(idea => (
                  <Card key={idea.id} className="bg-card border-border hover:shadow-lg transition-shadow relative">
                    <CardContent>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-emerald-500/10 p-2 rounded-full">
                             {idea.photoURL ? (
   <Image
  src={idea.photoURL}
  alt={idea.author}
  width={32}
  height={32}
  className="rounded-full"
/>
  ) : (
    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
      <User className="h-4 w-4 text-white" />
    </div>
  )}
                          </div>
                          <div>
                            <p className="font-semibold">{idea.author}</p>
                            <p className="text-sm text-muted-foreground">{idea.city}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{idea.time}</span>
                      </div>

                      <p className="mb-4 leading-relaxed">{idea.idea}</p>

                      <div className="flex items-center justify-between">
                        <Button onClick={() => handleLike(idea.id)} variant="ghost" size="sm">
                          <Heart className={`h-4 w-4 mr-1 ${idea.likes > 0 ? "text-red-500" : "text-white"}`} />
                          {idea.likes}
                        </Button>
                        <div className="flex gap-2">
                          <Button onClick={() => setOpenCommentModal({ open: true, ideaId: idea.id })} variant="ghost" size="sm" disabled={!user}>
                            <MessageSquare className="h-4 w-4 mr-1" /> Comentar
                          </Button>
                          {user?.email === idea.email && (
                            <Button onClick={() => handleRemoveIdea(idea.id)} variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {idea.comments?.map(c => (
                        <div key={c.id} className="ml-0 border-b border-muted/20 py-1">
                          <p><span className="font-semibold">{c.author}:</span> {c.text} <span className="text-xs text-muted-foreground">({c.time})</span></p>
                          {c.replies?.map(r => (
                            <div key={r.id} className="ml-4 border-l border-muted/30 pl-2">
                              <p><span className="font-semibold">{r.author}:</span> {r.text} <span className="text-xs text-muted-foreground">({r.time})</span></p>
                            </div>
                          ))}
                          <Button size="sm" variant="ghost" onClick={() => setOpenCommentModal({ open: true, ideaId: idea.id, parentId: c.id })} disabled={!user}>Responder</Button>
                        </div>
                      ))}
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
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-0">
                    <button onClick={() => toggleFaq(index)} className="w-full p-6 text-left flex items-center justify-between">
                      <h3 className="font-semibold pr-4">{faq.question}</h3>
                      {expandedFaq === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                    {expandedFaq === index && <div className="px-6 pb-6"><p>{faq.answer}</p></div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Modal comentário */}
          {openCommentModal.open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg w-96">
                <h3 className="text-lg font-bold mb-4">Adicionar Comentário</h3>
                <form onSubmit={handleSubmitCommentModal} className="space-y-3">
                  <Input placeholder="Seu nome" value={commentInputs.author} onChange={(e) => setCommentInputs({...commentInputs, author: e.target.value})} required disabled={!user} />
                  <Textarea placeholder={!user ? "Faça login para comentar" : "Digite seu comentário..."} value={commentInputs.text} onChange={(e) => setCommentInputs({...commentInputs, text: e.target.value})} required rows={3} disabled={!user} />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" onClick={() => setOpenCommentModal({ open: false })}>Cancelar</Button>
                    <Button type="submit" disabled={!user}>{user ? "Enviar" : "Faça login para enviar"}</Button>
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
