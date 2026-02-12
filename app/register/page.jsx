"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [classe, setClasse] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, classe }),
    });

    const data = await res.json();
    setResult(data);

    if (data.user_id && typeof window !== "undefined") {
      localStorage.setItem("user_id", data.user_id);
    }
  }

  return (
    <main>
      <h2>Créer un élève</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Prénom"
          value={prenom}
          onChange={e => setPrenom(e.target.value)}
        />
        <input
          placeholder="Nom"
          value={nom}
          onChange={e => setNom(e.target.value)}
        />
        <input
          placeholder="Classe (ex : 4A)"
          value={classe}
          onChange={e => setClasse(e.target.value)}
        />
        <button type="submit">Enregistrer</button>
      </form>

      {result && (
        <div>
          <p>Élève créé avec l’ID : <b>{result.user_id}</b></p>
          <p>Page notes : <code>{result.notesUrl}</code></p>
        </div>
      )}
    </main>
  );
}
