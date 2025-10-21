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
import {
  Heart,
  User,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

// ---------------------- Tipagens ----------------------
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

// ---------------------- Componente ----------------------
export function UserDashboard() {
  const topRef = useRef<HTMLDivElement | null>(null);

  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState<NewIdea>({ city: "", idea: "" });

  const [activeTab, setActiveTab] = useState<"ideias" | "comentarios" | "dados">(
    "ideias"
  );

  const [openCommentModal, setOpenCommentModal] = useState<{
    open: boolean;
    ideaId?: string;
    parentId?: number | null;
  }>({ open: false, ideaId: undefined, parentId: null });

  const [commentInputs, setCommentInputs] = useState({
    author: "",
    text: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ideasPerPage = 5;

  const [loadingIdea, setLoadingIdea] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

  // ---------------------- Autenticação ----------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // ---------------------- Fetch em tempo real ----------------------
  useEffect(() => {
    const q = query(collection(db, "ideas"), orderBy("time", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched: Idea[] = snapshot.docs.map((d) => {
        const data: any = d.data();
        return {
          id: d.id,
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
      setIdeas(fetched);
    });

    return () => unsub();
  }, []);

  // ---------------------- Sincronizar autor do comentário ----------------------
  useEffect(() => {
    if (openCommentModal.open && user) {
      setCommentInputs((prev) => ({
        ...prev,
        author: user.displayName || user.email || "",
      }));
    }
  }, [openCommentModal.open, user]);

  // ---------------------- Formatação de tempo ----------------------
  const formatTime = (time: any) => {
    if (!time) return "Agora";
    return time.toDate
      ? formatDistanceToNow(time.toDate(), { addSuffix: true, locale: ptBR })
      : typeof time === "string"
      ? time
      : formatDistanceToNow(time, { addSuffix: true, locale: ptBR });
  };

  // ---------------------- Submit de nova ideia ----------------------
  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Faça login para compartilhar uma ideia.");
      return;
    }

    // Validações
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
        photoURL: user.photoURL || "",
        city: newIdea.city,
        idea: newIdea.idea,
        likes: 0,
        likedBy: [],
        time: new Date(),
        comments: [],
      };

      setIdeas((prev) => [newIdeaObj, ...prev]);
      setNewIdea({ city: "", idea: "" });
      setCurrentPage(1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

      // Salvar no Google Sheets
      try {
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
      } catch (err) {
        console.error("Erro ao salvar no sheet:", err);
      }
    } catch (err) {
      console.error("Erro ao salvar ideia:", err);
    } finally {
      setLoadingIdea(false);
    }
  };

  // ---------------------- Toggle Like ----------------------
  const handleToggleLike = async (id: string) => {
    if (!user) return;
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;

    const likedByArray = Array.isArray(idea.likedBy) ? idea.likedBy : [];
    const hasLiked = likedByArray.includes(user.email);
    const updatedLikedBy = hasLiked
      ? likedByArray.filter((e) => e !== user.email)
      : [...likedByArray, user.email];

    try {
      await updateDoc(doc(db, "ideas", id), {
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
    } catch (err) {
      console.error("Erro ao atualizar like:", err);
    }
  };

  // ---------------------- Submit comentário modal ----------------------
  const handleSubmitCommentModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !commentInputs.author ||
      !commentInputs.text ||
      !openCommentModal.ideaId ||
      !user
    )
      return;

    const ideaRef = doc(db, "ideas", openCommentModal.ideaId);
    const idea = ideas.find((i) => i.id === openCommentModal.ideaId);
    if (!idea) return;

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

      const addReply = (comments: Comment[] = []): Comment[] =>
        comments.map((c) =>
          c.id === openCommentModal.parentId
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : { ...c, replies: addReply(c.replies || []) }
        );

      let updatedComments: Comment[] = [...(idea.comments || [])];

      if (openCommentModal.parentId) {
        updatedComments = addReply(updatedComments);
      } else {
        updatedComments.push(newComment);
      }

      await updateDoc(ideaRef, { comments: updatedComments });

      setIdeas((prev) =>
        prev.map((i) =>
          i.id === openCommentModal.ideaId ? { ...i, comments: updatedComments } : i
        )
      );

      setCommentInputs({ author: "", text: "" });
      setOpenCommentModal({ open: false });

      // Salvar comentário no Sheets
      try {
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
      } catch (err) {
        console.error("Erro ao salvar comentário no sheet:", err);
      }
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
    } finally {
      setLoadingComment(false);
    }
  };

  // ---------------------- Remove ideia ----------------------
  const handleRemoveIdea = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ideas", id));
      setIdeas((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Erro ao remover ideia:", err);
    }
  };

  // ---------------------- Remove comentário recursivo ----------------------
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
    } catch (err) {
      console.error("Erro ao remover comentário:", err);
    }
  };

  // ---------------------- Renderiza comentários recursivamente ----------------------
  const renderComments = (comments: Comment[], ideaId: string) =>
    (comments || []).map((comment) => (
      <div key={comment.id} className="ml-0 border-b border-muted/20 py-2">
        <p>
          <span className="font-semibold">{comment.author}:</span>{" "}
          {comment.text}{" "}
          <span className="text-xs text-muted-foreground">
            ({formatTime(comment.time)})
          </span>
        </p>

        <div className="flex gap-2 mt-2">
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

  // ---------------------- Filtragem para tabs ----------------------
  const userHasComment = (idea: Idea) => {
    const check = (comments: Comment[] = []): boolean =>
      comments.some(
        (c) =>
          c.email === user?.email ||
          (c.replies && check(c.replies))
      );

    return check(idea.comments || []);
  };

  const filteredIdeas = ideas.filter((i) =>
    activeTab === "ideias" ? i.email === user?.email : userHasComment(i)
  );

  // ---------------------- Paginação ----------------------
  const totalPages = Math.max(1, Math.ceil(filteredIdeas.length / ideasPerPage));
  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;
  const currentIdeas = filteredIdeas.slice(indexOfFirstIdea, indexOfLastIdea);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p>Faça login com Google para ver seu painel.</p>
      </div>
    );
  }

  return (
    <section id="user-dashboard" className="py-10 container mx-auto px-4" ref={topRef}>
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Meu Painel</h2>
        <p className="text-muted-foreground">Minhas ideias e meus comentários</p>
      </div>

      {/* ---------------------- Tabs ---------------------- */}
      <div className="flex justify-center mb-6">
        <div className="bg-background rounded-lg p-1 border border-border">
          <Button
            variant={activeTab === "ideias" ? "default" : "ghost"}
            onClick={() => {
              setActiveTab("ideias");
              setCurrentPage(1);
            }}
            className="cursor-pointer"
          >
            Minhas Ideias
          </Button>
          <Button
            variant={activeTab === "comentarios" ? "default" : "ghost"}
            onClick={() => {
              setActiveTab("comentarios");
              setCurrentPage(1);
            }}
            className="cursor-pointer"
          >
            Meus Comentários
          </Button>
          <Button
            variant={activeTab === "dados" ? "default" : "ghost"}
            onClick={() => setActiveTab("dados")}
            className="cursor-pointer"
          >
            Minhas Informações
          </Button>
        </div>
      </div>

      {/* ---------------------- Conteúdo das Tabs ---------------------- */}
      {activeTab !== "dados" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário lateral */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-24">
              <CardHeader>
                <CardTitle>Compartilhe sua ideia</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitIdea} className="space-y-4">
                  <Input
                    placeholder="Cidade, País"
                    value={newIdea.city}
                    onChange={(e) => setNewIdea({ ...newIdea, city: e.target.value })}
                    required
                    pattern="^[^,]+,\s*[^,]+$"
                    title="Digite no formato: Cidade, País"
                    disabled={!user}
                  />
                  <Textarea
                    placeholder={!user ? "Faça login para adicionar ideias" : "Descreva sua ideia..."}
                    value={newIdea.idea}
                    onChange={(e) => setNewIdea({ ...newIdea, idea: e.target.value })}
                    required
                    rows={3}
                    disabled={!user}
                    minLength={10}
                    title="A ideia deve ter pelo menos 10 caracteres"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={!user || loadingIdea} className="cursor-pointer">
                      {loadingIdea ? "Salvando..." : "Compartilhar"}
                    </Button>
                  </div>
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
                          <Image src={idea.photoURL} alt={idea.author} width={32} height={32} className="rounded-full" />
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
                    <span className="text-xs text-muted-foreground">{formatTime(idea.time)}</span>
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
                        className={`h-4 w-4 mr-1 ${Array.isArray(idea.likedBy) && idea.likedBy.includes(user.email) ? "text-red-500" : "text-white"}`}
                      />
                      {idea.likes}
                    </Button>

                    <div className="flex items-center justify-end w-full gap-2">
                      <Button
                        onClick={() => setOpenCommentModal({ open: true, ideaId: idea.id })}
                        variant="ghost"
                        size="sm"
                        disabled={!user}
                        className="cursor-pointer"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="ml-1">{idea.comments?.length || 0}</span>
                      </Button>

                      {idea.email === user.email && (
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

                  {/* Renderização dos comentários */}
                  <div className="mt-3">
                    {activeTab === "ideias"
                      ? renderComments(idea.comments || [], idea.id)
                      : (idea.comments || [])
                          .filter(
                            (c) =>
                              c.email === user.email ||
                              (c.replies || []).some((r) => r.email === user.email)
                          )
                          .map((c) => (
                            <div key={c.id} className="ml-0 border-b border-muted/20 py-2">
                              <p>
                                <span className="font-semibold">{c.author}:</span>{" "}
                                {c.text}{" "}
                                <span className="text-xs text-muted-foreground">({formatTime(c.time)})</span>
                              </p>
                              <div className="flex gap-2 mt-1">
                                {user?.email && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setOpenCommentModal({
                                        open: true,
                                        ideaId: idea.id,
                                        parentId: c.id,
                                      })
                                    }
                                  >
                                    Responder
                                  </Button>
                                )}
                                {user?.email && c.email && user.email === c.email && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveComment(idea.id, c.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                )}
                              </div>
                              {c.replies?.length ? <div className="ml-4">{renderComments(c.replies, idea.id)}</div> : null}
                            </div>
                          ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Paginação */}
            {filteredIdeas.length > ideasPerPage && (
              <div className="flex justify-center gap-4 mt-6">
                <Button onClick={() => { if (currentPage > 1) setCurrentPage((p) => p - 1); }} disabled={currentPage === 1}>
                  Anterior
                </Button>

                <span className="flex items-center gap-2">
                  Página {currentPage} de {totalPages}
                </span>

                <Button onClick={() => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); }} disabled={currentPage === totalPages}>
                  Próximo
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------- Tab de Dados do Usuário ---------------------- */}
      {activeTab === "dados" && (
        <div className="max-w-md mx-auto">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Minhas Informações</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "Usuário"}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
              <p className="font-semibold text-lg">{user.displayName || user.email}</p>
              <p className="text-sm text-muted-foreground">Email: {user.email}</p>
              <p className="text-sm text-muted-foreground">UID: {user.uid}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---------------------- Modal de comentário ---------------------- */}
      {openCommentModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Adicionar Comentário</h3>

            <form onSubmit={handleSubmitCommentModal} className="space-y-3">
              <Input
                placeholder="Seu nome"
                value={commentInputs.author || user.displayName || ""}
                onChange={(e) => setCommentInputs({ ...commentInputs, author: e.target.value })}
                disabled
              />
              <Textarea
                placeholder="Comentário"
                value={commentInputs.text || ""}
                onChange={(e) => setCommentInputs({ ...commentInputs, text: e.target.value })}
                rows={3}
                required
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenCommentModal({ open: false })}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loadingComment}>
                  {loadingComment ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
