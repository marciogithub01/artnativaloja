"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Perfil() {
  const { user, logout } = useAuth();

  if (!user) return <p>Nenhum usuário logado.</p>;

  return (
    <div>
      <h2>Bem-vindo, {user.email}</h2>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
