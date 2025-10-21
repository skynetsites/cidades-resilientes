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
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
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

type UserDashboardProps = {
  user: any; // ou defina um tipo mais preciso se quiser
};

export function UserDashboard({ user: initialUser }: UserDashboardProps) {
  const topRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<any>(initialUser);

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState<NewIdea>({ city: "", idea: "" });
  const [commentInputs, setCommentInputs] = useState({ author: "", text: "" });
  const [openCommentModal, setOpenCommentModal] = useState<{
    open: boolean;
    ideaId?: string;
    parentId?: number | null;
  }>({ open: false, ideaId: undefined, parentId: null });

  const [activeTab, setActiveTab] = useState<
    "ideias" | "comentarios" | "dados"
  >("ideias");
  const [currentPage, setCurrentPage] = useState(1);
  const ideasPerPage = 5;

  const [loadingIdea, setLoadingIdea] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [successIdea, setSuccessIdea] = useState(false);
  const [successComment, setSuccessComment] = useState(false);

  // -------------------- Auth --------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // -------------------- Fetch User Ideas --------------------
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const snapshot = await getDocs(collection(db, "ideas"));
        const fetchedIdeas: Idea[] = snapshot.docs
          .map((doc) => {
            const data: any = doc.data();
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
          })
          .sort((a, b) => b.time.getTime() - a.time.getTime());

        setIdeas(fetchedIdeas);
      } catch (err) {
        console.error("Erro ao buscar ideias:", err);
      }
    };

    fetchIdeas();
  }, []);

  // -------------------- Set author in comment --------------------
  useEffect(() => {
    if (openCommentModal.open && user) {
      setCommentInputs((prev) => ({
        ...prev,
        author: user.displayName || user.email || "",
      }));
    }
  }, [openCommentModal.open, user]);

  // -------------------- Format Time --------------------
  const formatTime = (time: any) => {
    if (!time) return "Agora";
    return time.toDate
      ? formatDistanceToNow(time.toDate(), { addSuffix: true, locale: ptBR })
      : typeof time === "string"
      ? time
      : formatDistanceToNow(time, { addSuffix: true, locale: ptBR });
  };

  // -------------------- Submit Idea --------------------
  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

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
      setSuccessIdea(true);

      topRef.current?.scrollIntoView({ behavior: "smooth" });

      // salvar no sheet
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
    } catch (err) {
      console.error("Erro ao salvar ideia:", err);
    } finally {
      setLoadingIdea(false);
    }
  };

  // -------------------- Toggle Like --------------------
  const handleToggleLike = async (id: string) => {
    if (!user) return;
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;

    const likedByArray = Array.isArray(idea.likedBy) ? idea.likedBy : [];
    const hasLiked = likedByArray.includes(user.email);
    const updatedLikedBy = hasLiked
      ? likedByArray.filter((e) => e !== user.email)
      : [...likedByArray, user.email];

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
  };

  // -------------------- Submit Comment --------------------
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

      let updatedComments = [...(idea.comments || [])];

      const addReply = (comments: Comment[] = []): Comment[] =>
        comments.map((c) =>
          c.id === openCommentModal.parentId
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : { ...c, replies: addReply(c.replies || []) }
        );

      if (openCommentModal.parentId) {
        updatedComments = addReply(updatedComments);
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

      // salvar apenas comentários no sheet, sem duplicar ideia
      await fetch("/api/save-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: idea.id,
          comments: updatedComments,
        }),
      });

      setCommentInputs({ author: "", text: "" });
      setOpenCommentModal({ open: false });
      setSuccessComment(true);
      setTimeout(() => setSuccessComment(false), 1000);
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
    } finally {
      setLoadingComment(false);
    }
  };

  // -------------------- Remove Idea --------------------
  const handleRemoveIdea = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ideas", id));
      setIdeas((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Erro ao remover ideia:", err);
    }
  };

  // -------------------- Remove Comment --------------------
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

      // salvar apenas comentários atualizados
      await fetch("/api/save-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId,
          comments: updatedComments,
        }),
      });
    } catch (err) {
      console.error("Erro ao remover comentário:", err);
    }
  };

  // -------------------- Render Comments --------------------
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
            >
              Responder
            </Button>
          )}
          {user?.email && comment.email && user.email === comment.email && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveComment(ideaId, comment.id)}
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

  // -------------------- Filtragem por Tabs --------------------
  const userHasComment = (idea: Idea) => {
    const check = (comments: Comment[] = []): boolean =>
      comments.some(
        (c) => c.email === user?.email || (c.replies && check(c.replies))
      );
    return check(idea.comments || []);
  };

  const filteredIdeas = ideas.filter((i) =>
    activeTab === "ideias"
      ? i.email === user?.email
      : activeTab === "comentarios"
      ? userHasComment(i)
      : true
  );

  // -------------------- Paginação --------------------
  const totalPages = Math.max(
    1,
    Math.ceil(filteredIdeas.length / ideasPerPage)
  );
  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;
  const currentIdeas = filteredIdeas.slice(indexOfFirstIdea, indexOfLastIdea);

  return (
    <section className="pt-40 py-20 bg-muted/30">
      <div ref={topRef} className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meu Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-7">
            Aqui você pode acompanhar suas ideias, comentários e dados.
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-foreground">Bem-vindo, {user?.displayName || user?.email}</h3>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-background rounded-lg p-1 border border-border space-x-2">
            <Button
              variant={activeTab === "ideias" ? "default" : "ghost"}
              onClick={() => setActiveTab("ideias")}
              className="cursor-pointer"
            >
              Minhas Ideias
            </Button>
            <Button
              variant={activeTab === "comentarios" ? "default" : "ghost"}
              onClick={() => setActiveTab("comentarios")}
              className="cursor-pointer"
            >
              Meus Comentários
            </Button>
            <Button
              variant={activeTab === "dados" ? "default" : "ghost"}
              onClick={() => setActiveTab("dados")}
              className="cursor-pointer"
            >
              Meus Dados
            </Button>
          </div>
        </div>

          <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulario para novas ideias */}
        { (activeTab === "ideias" || activeTab === "comentarios") &&  (
          <div className="lg:col-span-1 mb-8">
            <Card className="bg-card border-border sticky top-24">
              <CardHeader>
                <CardTitle>Compartilhe sua ideia</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitIdea} className="space-y-4">
                  <Input
                    placeholder="Cidade, País"
                    value={newIdea.city}
                    onChange={(e) =>
                      setNewIdea({ ...newIdea, city: e.target.value })
                    }
                    required
                    disabled={!user}
                    pattern="^[^,]+,\s*[^,]+$"
                    title="Digite no formato: Cidade, País"
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
                    minLength={10}
                    title="A ideia deve ter pelo menos 10 caracteres"
                  />
                  <Button 
                  type="submit" 
                  disabled={!user}
                  onClick={() => setActiveTab("ideias")}
                  className="cursor-pointer"
                  >
                    {user ? "Compartilhar" : "Faça login para compartilhar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de ideias do usuário */}
        {activeTab !== "dados" && (
          <div className="lg:col-span-2 space-y-6">
            {currentIdeas.length === 0 && (
              <div className="px-10 py-5 text-xl md:text-base text-muted-foreground">
                {activeTab === "ideias"
                  ? "Você ainda não tem ideias cadastradas."
                  : activeTab === "comentarios"
                  ? "Você ainda não comentou em nenhuma ideia."
                  : ""}
              </div>
            )}

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
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="ml-1">
                          {idea.comments?.length || 0}
                        </span>
                      </Button>

                      {user?.email &&
                        idea.email &&
                        user.email === idea.email && (
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

                  {idea.comments?.length
                    ? renderComments(idea.comments, idea.id)
                    : null}
                </CardContent>
              </Card>
            ))}

            {/* Paginação */}
            {filteredIdeas.length > ideasPerPage && (
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="flex items-center gap-2">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            )}
          </div>
        )}
</div>
        {/* ---------------------- Tab de Dados do Usuário ---------------------- */}
        {activeTab === "dados" && (
          <div className="max-w-md mx-auto">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Minhas Informações</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                {user ? (
                  user.photoURL ? (
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
                  )
                ) : (
                  <div className="text-center text-muted-foreground">
                    Carregando informações...
                  </div>
                )}

                {user && (
                  <>
                    <p className="font-semibold text-lg">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email: {user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      UID: {user.uid}
                    </p>
                  </>
                )}
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
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Enviar</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
