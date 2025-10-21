"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redireciona automaticamente se já estiver logado
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace("/dashboard"); // Redireciona após login
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  // Enquanto carrega, mostra o Spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen py-35 pb-20">
      <Card className="bg-card mt-10 border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold mb-6">
            Faça login para acessar o painel
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="text-center text-muted-foreground">
            <Button onClick={handleGoogleSignIn}>Entrar com Google</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
