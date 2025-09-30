"use client";
import { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthContext } from "@/context/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);

  const doLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert("Login feito com sucesso!");
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="p-6">
      <h1>Login</h1>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={doLogin}>Entrar</button>
    </div>
  );
}
