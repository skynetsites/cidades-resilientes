"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UserDashboard } from "@/components/user-panel";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login"); // redireciona se não autenticado
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Enquanto carrega, mostra o Spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-16 h-16" />
      </div>
    );
  }

  // Se não tiver usuário, ele já foi redirecionado, então renderiza o dashboard
  return (
  <UserDashboard user={user} />
);
}
