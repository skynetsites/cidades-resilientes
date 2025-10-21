"use client";

import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ChevronDown, ChevronUp, Heart, User, Trash2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import {ptBR} from "date-fns/locale/pt-BR";

type Comment = {
  id: number;
  author: string;
  text: string;
  time: Date;
  replies?: Comment[];
};

type Idea = {
  id: string;
  author: string;
  email: string;
  photoURL?: string;
  city: string;
  idea: string;
  likes: number;
  time: Date;
  comments?: Comment[];
};

type NewIdea = Omit<Idea, "id" | "likes" | "time" | "author" | "email">;

export function CommunitySection() {
  const topRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [activeTab, setActiveTab] = useState("ideias");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [openCommentModal, setOpenCommentModal] = useState<{ open: boolean; ideaId?: string; parentId?: number }>({ open: false });

  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState<NewIdea>({ city: "", idea: "" });
  const [commentInputs, setCommentInputs] = useState({ author: "", text: "" });

  // Exemplo de ideias fixas
  const exampleIdeas: Idea[] = [
    { id: "ex1", author: "Maria Silva", email: "maria@email.com", city: "São Paulo", idea: "Implementar jardins verticais em prédios públicos.", likes: 24, time: new Date(), comments: [{ id: 1, author: "Carlos", text: "Excelente ideia!", time: new Date() }] },
    { id: "ex2", author: "João Santos", email: "joao@email.com", city: "Rio de Janeiro", idea: "Criar ciclovias conectadas com estações de bike-sharing.", likes: 18, time: new Date(), comments: [] },
    { id: "ex3", author: "Ana Costa", email: "ana@email.com", city: "Belo Horizonte", idea: "Desenvolver app para monitoramento da qualidade do ar.", likes: 31, time: new Date(), comments: [] },
  ];

  // Persistência de login
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  // Carregar ideias do Firestore
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ideas"));
        const fetchedIdeas: Idea[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            author: data.author,
            email: data.email,
            photoURL: data.photoURL,
            city: data.city,
            idea: data.idea,
            likes: data.likes || 0,
            time: data.time?.toDate ? data.time.toDate() : new Date(),
            comments: data.comments || [],
          };
        });

        // Ordenar por mais recente primeiro e incluir exemplos
        const allIdeas = [...fetchedIdeas].sort((a, b) => b.time.getTime() - a.time.getTime());
        setIdeas([...exampleIdeas, ...allIdeas]);
      } catch (error) {
        console.error("Erro ao buscar ideias:", error);
        setIdeas([...exampleIdeas]);
      }
    };

    fetchIdeas();
  }, []);

  // Submissão de ideia
  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newIdea.city || !newIdea.idea) return;

    try {
      const docRef = await addDoc(collection(db, "ideas"), {
        author: user.displayName,
        email: user.email,
        photoURL: user.photoURL || "",
        city: newIdea.city,
        idea: newIdea.idea,
        likes: 0,
        time: serverTimestamp(),
        comments: [],
      });

      const newIdeaObj: Idea = {
        id: docRef.id,
        author: user.displayName!,
        email: user.email!,
        photoURL: user.photoURL,
        city: newIdea.city,
        idea: newIdea.idea,
        likes: 0,
        time: new Date(),
        comments: [],
      };

      setIdeas([newIdeaObj, ...ideas]);
      setNewIdea({ city: "", idea: "" });
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao salvar ideia:", error);
    }
  };

  // Curtir ideia
  const handleLike = async (id: string) => {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;

    try {
      await updateDoc(doc(db, "ideas", id), { likes: idea.likes + 1 });
      setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, likes: i.likes + 1 } : i)));
    } catch (error) {
      console.error("Erro ao atualizar likes:", error);
    }
  };

  // Remover ideia
  const handleRemoveIdea = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ideas", id));
      setIdeas((prev) => prev.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error("Erro ao remover ideia:", error);
    }
  };

  // Submissão de comentário
  const handleSubmitCommentModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInputs.author || !commentInputs.text || !openCommentModal.ideaId) return;

    const ideaRef = doc(db, "ideas", openCommentModal.ideaId);
    const newComment: Comment = {
      id: Date.now(),
      author: commentInputs.author,
      text: commentInputs.text,
      time: new Date(),
    };

    try {
      const idea = ideas.find((i) => i.id === openCommentModal.ideaId);
      if (!idea) return;

      let updatedComments: Comment[];
      if (openCommentModal.parentId) {
        const addReply = (comments: Comment[] = []) =>
          comments.map((c) =>
            c.id === openCommentModal.parentId ? { ...c, replies: [...(c.replies || []), newComment] } : c
          );
        updatedComments = addReply(idea.comments);
      } else {
        updatedComments = [...(idea.comments || []), newComment];
      }

      await updateDoc(ideaRef, { comments: updatedComments });
      setIdeas((prev) => prev.map((i) => (i.id === openCommentModal.ideaId ? { ...i, comments: updatedComments } : i)));
      setCommentInputs({ author: "", text: "" });
      setOpenCommentModal({ open: false });
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  const faqs = [
    { question: "Como posso contribuir para tornar minha cidade mais sustentável?", answer: "Participe de iniciativas locais, compartilhe ideias e engaje sua comunidade." },
    { question: "O que são cidades inteligentes?", answer: "Cidades inteligentes usam tecnologia e dados para melhorar a vida dos cidadãos." },
    { question: "Como o movimento global funciona?", answer: "Conectamos pessoas e organizações para compartilhar conhecimento e práticas urbanas." },
    { question: "Posso implementar as ideias da plataforma na minha cidade?", answer: "Sim! Todas as ideias são públicas e adaptáveis a diferentes contextos." },
  ];

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ideasPerPage = 5;
  const totalPages = Math.ceil(ideas.length / ideasPerPage);
  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;
  const currentIdeas = ideas.slice(indexOfFirstIdea, indexOfLastIdea);

  const goToNextPage = () => { if (currentPage < totalPages) { setCurrentPage(prev => prev + 1); scrollToTitle(); } };
  const goToPrevPage = () => { if (currentPage > 1) { setCurrentPage(prev => prev - 1); scrollToTitle(); } };
  const scrollToTitle = () => { if (titleRef.current) titleRef.current.scrollIntoView({ behavior: "smooth" }); };
  const toggleFaq = (index: number) => setExpandedFaq(expandedFaq === index ? null : index);
  const formatTime = (time: Date) => formatDistanceToNow(time, { addSuffix: true, locale: ptBR });

  // Renderização
  return (
    <section id="comunidade" className="py-20 bg-muted/30">
      <div ref={topRef} className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              ref={titleRef}
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              Comunidade & Interação
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Conecte-se, compartilhe ideias e construa soluções colaborativas
              para transformar nossas cidades.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-background rounded-lg p-1 border border-border">
              <Button
                variant={activeTab === "ideias" ? "default" : "ghost"}
                onClick={() => setActiveTab("ideias")}
              >
                Mural de Ideias
              </Button>
              <Button
                variant={activeTab === "faq" ? "default" : "ghost"}
                onClick={() => setActiveTab("faq")}
              >
                Perguntas Frequentes
              </Button>
            </div>
          </div>

          {/* Ideas Tab */}
          {activeTab === "ideias" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Formulário */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-border sticky top-24">
                  <CardHeader>
                    <CardTitle>Compartilhe sua Ideia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitIdea} className="space-y-4">
                      <Input
                        placeholder="Cidade"
                        value={newIdea.city}
                        onChange={(e) =>
                          setNewIdea({ ...newIdea, city: e.target.value })
                        }
                        required
                        disabled={!user}
                      />
                      <Textarea
                        placeholder={
                          !user
                            ? "Faça login para adicionar ideias"
                            : "Descreva sua ideia..."
                        }
                        value={newIdea.idea}
                        onChange={(e) =>
                          setNewIdea({ ...newIdea, idea: e.target.value })
                        }
                        required
                        rows={3}
                        disabled={!user}
                      />
                      <Button type="submit" disabled={!user}>
                        {user ? "Compartilhar" : "Faça login para compartilhar"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de ideias */}
              <div className="lg:col-span-2 space-y-6">
                {currentIdeas.map((idea) => (
                  <Card
                    key={idea.id}
                    className="bg-card border-border hover:shadow-lg transition-shadow relative"
                  >
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
                            <p className="text-sm text-muted-foreground">
                              {idea.city}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(idea.time)}
                        </span>
                      </div>

                      <p className="mb-4 leading-relaxed">{idea.idea}</p>

                      <div className="flex items-center justify-between">
                        <Button
                          onClick={() => handleLike(idea.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Heart
                            className={`h-4 w-4 mr-1 ${
                              idea.likes > 0 ? "text-red-500" : "text-white"
                            }`}
                          />
                          {idea.likes}
                        </Button>

                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              setOpenCommentModal({
                                open: true,
                                ideaId: idea.id,
                              })
                            }
                            variant="ghost"
                            size="sm"
                            disabled={!user}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Comentar
                          </Button>

                          {user?.email === idea.email && (
                            <Button
                              onClick={() => handleRemoveIdea(idea.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Comentários */}
                      {idea.comments?.map((c) => (
                        <div
                          key={c.id}
                          className="ml-0 border-b border-muted/20 py-1"
                        >
                          <p>
                            <span className="font-semibold">{c.author}:</span>{" "}
                            {c.text}{" "}
                            <span className="text-xs text-muted-foreground">
                              ({formatTime(c.time)})
                            </span>
                          </p>
                          {c.replies?.map((r) => (
                            <div
                              key={r.id}
                              className="ml-4 border-l border-muted/30 pl-2"
                            >
                              <p>
                                <span className="font-semibold">{r.author}:</span>{" "}
                                {r.text}{" "}
                                <span className="text-xs text-muted-foreground">
                                  ({formatTime(r.time)})
                                </span>
                              </p>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setOpenCommentModal({
                                open: true,
                                ideaId: idea.id,
                                parentId: c.id,
                              })
                            }
                            disabled={!user}
                          >
                            Responder
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-4 mt-4">
                    <Button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="px-2 py-1 bg-muted/30 rounded">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                    </Button>
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
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between"
                    >
                      <h3 className="font-semibold pr-4">{faq.question}</h3>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-6">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Modal comentário */}
          {openCommentModal.open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg w-96">
                <h3 className="text-lg font-bold mb-4">
                  Adicionar Comentário
                </h3>
                <form
                  onSubmit={handleSubmitCommentModal}
                  className="space-y-3"
                >
                  <Input
                    placeholder="Seu nome"
                    value={commentInputs.author}
                    onChange={(e) =>
                      setCommentInputs({
                        ...commentInputs,
                        author: e.target.value,
                      })
                    }
                    required
                    disabled={!user}
                  />
                  <Textarea
                    placeholder={
                      !user
                        ? "Faça login para comentar"
                        : "Digite seu comentário..."
                    }
                    value={commentInputs.text}
                    onChange={(e) =>
                      setCommentInputs({
                        ...commentInputs,
                        text: e.target.value,
                      })
                    }
                    required
                    rows={3}
                    disabled={!user}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      onClick={() => setOpenCommentModal({ open: false })}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={!user}>
                      {user ? "Enviar" : "Faça login para enviar"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
