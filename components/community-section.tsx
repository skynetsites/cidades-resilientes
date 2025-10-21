"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  User,
  Trash2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { auth, db, provider } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useRouter } from "next/navigation";

type Comment = {
  id: number;
  author: string;
  email?: string;
  text: string;
  time: any;
  replies?: Comment[];
};

type Idea = {
  id: string;
  author: string;
  email?: string;
  photoURL?: string;
  city: string;
  idea: string;
  likes: number;
  likedBy?: string[];
  time: any;
  comments?: Comment[];
};

type NewIdea = Omit<
  Idea,
  "id" | "likes" | "time" | "author" | "email" | "likedBy" | "comments"
>;

export function CommunitySection() {
  const topRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("ideias");
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState<NewIdea>({ city: "", idea: "" });
  const [commentInputs, setCommentInputs] = useState({ author: "", text: "" });
  const [openCommentModal, setOpenCommentModal] = useState<{
    open: boolean;
    ideaId?: string;
    parentId?: number;
  }>({ open: false });

  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const ideasPerPage = 5;

  const [loadingIdea, setLoadingIdea] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [successIdea, setSuccessIdea] = useState(false);
  const [successComment, setSuccessComment] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (openCommentModal.open && user) {
      setCommentInputs((prev) => ({
        ...prev,
        author: user.displayName || user.email || "",
      }));
    }
  }, [openCommentModal.open, user]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const snapshot = await getDocs(collection(db, "ideas"));
        const fetchedIdeas: Idea[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            author: data.author || "Anônimo",
            email: data.email || "",
            photoURL: data.photoURL || "",
            city: data.city || "",
            idea: data.idea || "",
            likes: data.likes || 0,
            likedBy: data.likedBy || [],
            time: data.time?.toDate ? data.time.toDate() : new Date(),
            comments: data.comments || [],
          };
        });
        fetchedIdeas.sort((a, b) => b.time.getTime() - a.time.getTime());
        setIdeas(fetchedIdeas);
      } catch (error) {
        console.error("Erro ao buscar ideias:", error);
        setIdeas([]);
      }
    };
    fetchIdeas();
  }, []);

  const formatTime = (time: any) => {
    if (!time) return "Agora";
    return time.toDate
      ? formatDistanceToNow(time.toDate(), { addSuffix: true, locale: ptBR })
      : typeof time === "string"
      ? time
      : formatDistanceToNow(time, { addSuffix: true, locale: ptBR });
  };

  // ------------------- Submissão de Ideias -------------------
  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // 🔎 Validações extras
    const cityRegex = /^[^,]+,\s*[^,]+$/;
    if (!cityRegex.test(newIdea.city)) {
      alert("Por favor, insira no formato: Cidade, País");
      return;
    }

    if (newIdea.idea.trim().length < 10) {
      alert("A ideia deve ter pelo menos 10 caracteres.");
      return;
    }

    try {
      setLoadingIdea(true);
      const docRef = await addDoc(collection(db, "ideas"), {
        author: user.displayName,
        email: user.email,
        photoURL: user.photoURL || "",
        city: newIdea.city,
        idea: newIdea.idea,
        likes: 0,
        likedBy: [],
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
        likedBy: [],
        time: new Date(),
        comments: [],
      };

      setIdeas([newIdeaObj, ...ideas]);
      setNewIdea({ city: "", idea: "" });
      setSuccessIdea(true);
      setCurrentPage(1); // sempre volta para página 1
      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);

      await fetch("/api/save-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: docRef.id,
          author: user.displayName,
          email: user.email,
          city: newIdea.city,
          idea: newIdea.idea,
          likes: 0,
          comments: [],
        }),
      });

      setTimeout(() => setSuccessIdea(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar ideia:", error);
    } finally {
      setLoadingIdea(false);
    }
  };

  const handleToggleLike = async (id: string) => {
    if (!user) return;
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;

    const hasLiked = idea.likedBy?.includes(user.email);
    const ideaRef = doc(db, "ideas", id);
    const likedByArray = Array.isArray(idea.likedBy) ? idea.likedBy : [];
    const updatedLikedBy = hasLiked
      ? likedByArray.filter((e) => e !== user.email)
      : [...likedByArray, user.email];

    await updateDoc(ideaRef, {
      likedBy: updatedLikedBy,
      likes: updatedLikedBy.length,
    });
    setIdeas((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, likedBy: updatedLikedBy, likes: updatedLikedBy.length }
          : i
      )
    );
  };

  const handleSubmitCommentModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !commentInputs.author ||
      !commentInputs.text ||
      !openCommentModal.ideaId
    )
      return;

    const ideaRef = doc(db, "ideas", openCommentModal.ideaId);
    const newComment: Comment = {
      id: Date.now(),
      author: commentInputs.author,
      email: user?.email,
      text: commentInputs.text,
      time: new Date(),
      replies: [],
    };

    try {
      setLoadingComment(true);
      const idea = ideas.find((i) => i.id === openCommentModal.ideaId);
      if (!idea) return;

      const updatedComments = [...(idea.comments || [])];

      const addReply = (comments: Comment[] = []): Comment[] =>
        comments.map((c) =>
          c.id === openCommentModal.parentId
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : { ...c, replies: addReply(c.replies || []) }
        );

      if (openCommentModal.parentId) {
        updatedComments.splice(
          0,
          updatedComments.length,
          ...addReply(updatedComments)
        );
      } else {
        updatedComments.push(newComment);
      }

      await updateDoc(ideaRef, { comments: updatedComments });
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === openCommentModal.ideaId
            ? { ...i, comments: updatedComments }
            : i
        )
      );

      setCommentInputs({ author: "", text: "" });
      setOpenCommentModal({ open: false });
      setSuccessComment(true);

      await fetch("/api/save-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: idea.id,
          author: idea.author,
          email: idea.email,
          city: idea.city,
          idea: idea.idea,
          likes: idea.likes,
          comments: updatedComments,
        }),
      });

      setTimeout(() => setSuccessComment(false), 3000);
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleRemoveIdea = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ideas", id));
      setIdeas((prev) => prev.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error("Erro ao remover ideia:", error);
    }
  };

  const handleRemoveComment = async (ideaId: string, commentId: number) => {
    try {
      const idea = ideas.find((i) => i.id === ideaId);
      if (!idea) return;

      const removeComment = (comments: Comment[] = []): Comment[] =>
        comments
          .filter((c) => c.id !== commentId)
          .map((c) => ({ ...c, replies: removeComment(c.replies || []) }));

      const updatedComments = removeComment(idea.comments);

      await updateDoc(doc(db, "ideas", ideaId), { comments: updatedComments });
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === ideaId ? { ...i, comments: updatedComments } : i
        )
      );
    } catch (error) {
      console.error("Erro ao remover comentário:", error);
    }
  };

  const renderComments = (comments: Comment[], ideaId: string) =>
    comments.map((comment) => (
      <div key={comment.id} className="ml-0 border-b border-muted/20 py-1">
        <p>
          <span className="font-semibold">{comment.author}:</span>{" "}
          {comment.text}{" "}
          <span className="text-xs text-muted-foreground">
            ({formatTime(comment.time)})
          </span>
        </p>
        <div className="flex gap-2 mt-1">
          {user?.email && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setOpenCommentModal({
                  open: true,
                  ideaId,
                  parentId: comment.id,
                })
              }
              className="cursor-pointer"
            >
              Responder
            </Button>
          )}
          {user?.email && comment.email && user.email === comment.email && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveComment(ideaId, comment.id)}
              className="cursor-pointer"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
        {comment.replies?.length ? (
          <div className="ml-4">{renderComments(comment.replies, ideaId)}</div>
        ) : null}
      </div>
    ));

  const totalPages = Math.ceil(ideas.length / ideasPerPage);
  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;
  const currentIdeas = ideas.slice(indexOfFirstIdea, indexOfLastIdea);

  const faqs = [
    {
      question:
        "Como posso contribuir para tornar minha cidade mais sustentável?",
      answer:
        "Participe de iniciativas locais, compartilhe ideias e engaje sua comunidade.",
    },
    {
      question: "O que são cidades inteligentes?",
      answer:
        "Cidades inteligentes usam tecnologia e dados para melhorar a vida dos cidadãos.",
    },
    {
      question: "Como o movimento global funciona?",
      answer:
        "Conectamos pessoas e organizações para compartilhar conhecimento e práticas urbanas.",
    },
    {
      question: "Posso implementar as ideias da plataforma na minha cidade?",
      answer:
        "Sim! Todas as ideias são públicas e adaptáveis a diferentes contextos.",
    },
  ];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <section id="comunidade" className="py-35 bg-muted/30">
      <div ref={topRef} className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Comunidade & Interação
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Conecte-se, compartilhe ideias e construa soluções colaborativas
            para transformar nossas cidades.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-background rounded-lg p-1 border border-border space-x-2">
            <Button
              variant={activeTab === "ideias" ? "default" : "ghost"}
              onClick={() => setActiveTab("ideias")}
              className="cursor-pointer"
            >
              Mural de Ideias
            </Button>
            <Button
              variant={activeTab === "faq" ? "default" : "ghost"}
              onClick={() => setActiveTab("faq")}
              className="cursor-pointer"
            >
              Perguntas Frequentes
            </Button>
            {user && (
              <Button
                onClick={() => router.push("/dashboard")}
                variant="default"
                disabled={!activeTab}
                className={`bg-emerald-500 cursor-pointer border-b-2 text-white ${
                  !activeTab
                    ? "border-red-500 opacity-50 cursor-not-allowed"
                    : "hover:bg-emerald-600 border-transparent"
                }`}
              >
                Minha Conta
              </Button>
            )}
          </div>
        </div>

        {activeTab === "ideias" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border sticky top-24">
                <CardHeader>
                  <CardTitle>Compartilhe sua ideia</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitIdea} className="space-y-4">
                    {/* Campo Cidade */}
                    <Input
                      placeholder="Cidade, País"
                      value={newIdea.city}
                      onChange={(e) =>
                        setNewIdea({ ...newIdea, city: e.target.value })
                      }
                      required
                      disabled={!user}
                      pattern="^[^,]+,\s*[^,]+$" // força "Cidade, País"
                      title="Digite no formato: Cidade, País"
                    />

                    {/* Campo Descrição da Ideia */}
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
                      minLength={10} // força no mínimo 10 caracteres
                      title="A ideia deve ter pelo menos 10 caracteres"
                    />

                    {/* Botão de envio */}
                    <Button
                      className="cursor-pointer"
                      //disabled={!user}
                      {...(!user
                        ? { onClick: handleLogin }
                        : { type: "submit" })}
                    >
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
                        onClick={() => handleToggleLike(idea.id)}
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <Heart
                          className={`h-4 w-4 mr-1 ${
                            idea.likedBy?.length ? "text-red-500" : "text-white"
                          }`}
                        />
                        {idea.likes}
                      </Button>
                      <div className="flex items-center justify-end w-full gap-2">
                        <Button
                          onClick={() =>
                            setOpenCommentModal({ open: true, ideaId: idea.id })
                          }
                          variant="ghost"
                          size="sm"
                          disabled={!user}
                          className="cursor-pointer"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="ml-1">
                            {idea.comments?.length || 0}
                          </span>
                        </Button>

                        {user?.email &&
                          idea.email &&
                          user.email === idea.email &&
                          idea.id && (
                            <Button
                              onClick={() => handleRemoveIdea(idea.id)}
                              variant="ghost"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                      </div>
                    </div>

                    {idea.comments?.length
                      ? renderComments(idea.comments, idea.id)
                      : null}
                  </CardContent>
                </Card>
              ))}

              {/* Paginação */}
              {ideas.length > ideasPerPage && (
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        setTimeout(
                          () =>
                            topRef.current?.scrollIntoView({
                              behavior: "smooth",
                            }),
                          50
                        );
                      }
                    }}
                    disabled={currentPage === 1}
                    className="cursor-pointer"
                  >
                    Anterior
                  </Button>

                  <span className="flex items-center gap-2">
                    Página {currentPage} de {totalPages}
                  </span>

                  <Button
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        setTimeout(
                          () =>
                            topRef.current?.scrollIntoView({
                              behavior: "smooth",
                            }),
                          50
                        );
                      }
                    }}
                    disabled={currentPage === totalPages}
                    className="cursor-pointer"
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
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full px-6 text-left flex items-center justify-between cursor-pointer"
                  >
                    <h3 className="text-3xl md:text-2xl font-semibold text-3x1 pr-4">
                      {faq.question}
                    </h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pt-5">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de comentário */}
        {openCommentModal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg w-96">
              <h3 className="text-lg font-bold mb-4">Adicionar Comentário</h3>
              <form onSubmit={handleSubmitCommentModal} className="space-y-3">
                <Input
                  placeholder="Seu nome"
                  value={commentInputs.author || ""}
                  onChange={(e) =>
                    setCommentInputs({
                      ...commentInputs,
                      author: e.target.value,
                    })
                  }
                  required
                  disabled={!!user}
                />
                <Textarea
                  placeholder="Comentário"
                  value={commentInputs.text || ""}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, text: e.target.value })
                  }
                  rows={3}
                  required
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenCommentModal({ open: false })}
                    className="cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="cursor-pointer">
                    Enviar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
