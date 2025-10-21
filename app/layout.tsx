import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
//import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title:
    "Movimento Global – Comunidade de Ideias Cidadãs (Cidades Resilientes)",
  description:
    "Transformando sugestões dos cidadãos em ações reais para cidades mais inteligentes, sustentáveis e resilientes.",

  keywords: [
    "Cidades Inteligentes",
    "Sustentabilidade Urbana",
    "Participação Cidadã",
    "Engajamento Social",
    "Resiliência Urbana",
    "Plataforma Colaborativa",
    "Mini Curso Ambiental",
    "Tecnologia para Cidades",
    "Votação de Ideias",
    "Gestão Pública",
    "Ideias Cidadãs",
    "Projeto Colaborativo",
    "Educação Ambiental",
    "Inovação Urbana",
    "Transformação Social",
    "Escalabilidade do Projeto",
  ],

  openGraph: {
    title:
      "Movimento Global – Comunidade de Ideias Cidadãs (Cidades Resilientes)",
    description:
      "Um site feito com Next.js + TypeScript + Firestore + Google Spreadsheets",
    url: "https://skynetsites.github.io/cidades-resilientes",
    siteName:
      "Movimento Global – Comunidade de Ideias Cidadãs (Cidades Resilientes)",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Movimento Global – Comunidade de Ideias Cidadãs (Cidades Resilientes)",
      },
    ],
    locale: "pt-BR",
    type: "website",
  },

   twitter: {
    card: "summary_large_image",
    title: "Meu Site Incrível",
    description:
      "Um site feito com Next.js + TypeScript + Firestore + Google Spreadsheets",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: "https://skynetsites.github.io/cidades-resilientes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        {/*<Analytics />*/}
      </body>
    </html>
  );
}
