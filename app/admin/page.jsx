"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");

    if (key !== process.env.NEXT_PUBLIC_ADMIN_KEY) {
      setAuthorized(false);
      return;
    }

    setAuthorized(true);

    fetch("/api/adminData")
      .then(r => r.json())
      .then(data => {
        setUsers(data.users || []);
        setNotes(data.notes || []);
      });
  }, []);

  if (!authorized) {
    return (
      <main>
        <h2>Accès refusé</h2>
        <p>Mot de passe incorrect.</p>
      </main>
    );
  }

  const totalEleves = users.length;
  const totalNotes = notes.length;

  const moyennesMatieres = {};
  notes.forEach(n => {
    if (!moyennesMatieres[n.matiere]) {
      moyennesMatieres[n.matiere] = { total: 0, coef: 0 };
    }
    moyennesMatieres[n.matiere].total += Number(n.note) * Number(n.coef);
    moyennesMatieres[n.matiere].coef += Number(n.coef);
  });

  const matieres = Object.keys(moyennesMatieres);

  const moyenneGlobale =
    matieres.length > 0
      ? (
          Object.values(moyennesMatieres).reduce((acc, m) => acc + m.total, 0) /
          Object.values(moyennesMatieres).reduce((acc, m) => acc + m.coef, 0)
        ).toFixed(2)
      : "-";

  return (
    <main>
      <h2>Admin — Statistiques</h2>

      <div className="stats-grid">
        <div className="card"><div className="card-content"><h2>Élèves</h2><p>{totalEleves}</p></div></div>
        <div className="card"><div className="card-content"><h2>Notes</h2><p>{totalNotes}</p></div></div>
        <div className="card"><div className="card-content"><h2>Moyenne globale</h2><p>{moyenneGlobale}</p></div></div>
      </div>

      <h3>Stats par matière</h3>
      <div className="projects-container">
        {matieres.map(m => (
          <div className="card" key={m}>
            <div className="card-content">
              <h2>{m}</h2>
              <p>Moyenne : {(moyennesMatieres[m].total / moyennesMatieres[m].coef).toFixed(2)}</p>
              <p>Notes : {notes.filter(n => n.matiere === m).length}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
