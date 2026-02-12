"use client";

import { useEffect, useState } from "react";

export default function NotesPage() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  const [matiere, setMatiere] = useState("");
  const [note, setNote] = useState("");
  const [coef, setCoef] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let u = params.get("u");

    if (!u) {
      const stored = localStorage.getItem("user_id");
      if (stored) {
        window.location.href = `/notes?u=${stored}`;
        return;
      }
    }

    setUserId(u);
    if (u) {
      fetchUser(u);
      fetchNotes(u);
    }
  }, []);

  async function fetchUser(u) {
    const res = await fetch(`/api/getUser?u=${u}`);
    const data = await res.json();
    if (!data.error) setUser(data);
  }

  async function fetchNotes(u) {
    const res = await fetch(`/api/getNotes?u=${u}`);
    const data = await res.json();
    setNotes(data.notes || []);
  }

  async function addNote(e) {
    e.preventDefault();
    if (!userId) return;

    await fetch("/api/addNote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, matiere, note, coef }),
    });

    fetchNotes(userId);
    setMatiere("");
    setNote("");
    setCoef(1);
  }

  const moyennes = {};
  notes.forEach(n => {
    if (!moyennes[n.matiere]) moyennes[n.matiere] = { total: 0, coef: 0 };
    moyennes[n.matiere].total += Number(n.note) * Number(n.coef);
    moyennes[n.matiere].coef += Number(n.coef);
  });

  const totalGeneral = Object.values(moyennes).reduce((a, m) => a + m.total, 0);
  const coefGeneral = Object.values(moyennes).reduce((a, m) => a + m.coef, 0);
  const moyenneGenerale = coefGeneral > 0 ? (totalGeneral / coefGeneral).toFixed(2) : "-";

  return (
    <main>
      <h2>
        {user
          ? `Notes de ${user.prenom} ${user.nom} (${user.classe})`
          : "Chargement..."}
      </h2>

      <section>
        <h3>Moyenne générale</h3>
        <p><strong>{moyenneGenerale}</strong></p>
      </section>

      <section>
        <h3>Ajouter une note</h3>
        <form onSubmit={addNote}>
          <input type="text" placeholder="Matière" value={matiere} onChange={e => setMatiere(e.target.value)} />
          <input type="number" placeholder="Note" value={note} onChange={e => setNote(e.target.value)} />
          <input type="number" placeholder="Coef" value={coef} onChange={e => setCoef(e.target.value)} />
          <button type="submit">Ajouter</button>
        </form>
      </section>

      <section>
        <h3>Moyennes par matière</h3>
        <div className="projects-container">
          {Object.keys(moyennes).map(m => (
            <div className="card" key={m}>
              <div className="card-content">
                <h2>{m}</h2>
                <p>Moyenne : {(moyennes[m].total / moyennes[m].coef).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Toutes les notes</h3>
        {notes.map((n, i) => (
          <p key={i}>
            <strong>{n.matiere}</strong> — {n.note} (coef {n.coef})
          </p>
        ))}
      </section>
    </main>
  );
}
