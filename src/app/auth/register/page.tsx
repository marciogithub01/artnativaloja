"use client";

import { useState, useContext, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AuthContext } from "@/context/auth";

export default function RegisterPage() {
  const { setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [cidade, setCidade] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name || !email || !cpf || !cidade || !password) return false;
    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) return false;
    if (password.length < 6) return false;
    if (!photo) return false;
    return true;
  };

  const doRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Preencha todos os campos corretamente e adicione uma foto.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

     
      const photoRef = ref(storage, `artesaos/${user.uid}/photo`);
      await uploadBytes(photoRef, photo!);
      const photoURL = await getDownloadURL(photoRef);

      
      await setDoc(doc(db, "artesaos", user.uid), {
        name,
        email,
        cpf,
        cidade,
        photoURL,
        isArtesao: true,
        createdAt: new Date(),
      });

      setUser(user);
      alert("Cadastro de vendedor realizado com sucesso!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Cadastro de Vendedor</h1>
      <form onSubmit={doRegister} className="flex flex-col gap-3">
        <input
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="CPF (somente números)"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Senha (mín. 6 caracteres)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
          className="border p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white p-2 mt-2 hover:bg-green-600"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}