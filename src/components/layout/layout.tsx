"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Art Nativa",
  description: "Plataforma de venda de artesanato local",
};

// Componente para exibir links de login/logout baseado no usuário
function NavLinks() {
  const auth = useAuth();

  if (!auth.user) {
    return (
      <Link
        className="uppercase font-bold text-md"
        href="/login"
      >
        Entrar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="font-medium">{auth.user.email}</span>
      <button
        onClick={auth.logout}
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Sair
      </button>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <nav className="fixed top-0 w-full flex items-center py-2 px-8 justify-between z-50 bg-slate-800 text-gray-300">
            <Link
              className="uppercase font-bold text-md h-12 flex items-center"
              href="/"
            >
              Art Nativa
            </Link>
            <NavLinks />
          </nav>
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
