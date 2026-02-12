import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  const files = await list();

  const usersFile = files.blobs.find(b => b.pathname === "users.csv");
  let users = [];
  if (usersFile) {
    const csv = await fetch(usersFile.url).then(r => r.text());
    const lines = csv.split("\n").slice(1);
    users = lines
      .map(l => l.split(","))
      .filter(p => p.length >= 4)
      .map(p => ({
        user_id: p[0],
        nom: p[1],
        prenom: p[2],
        classe: p[3],
      }));
  }

  const notesFile = files.blobs.find(b => b.pathname === "notes.csv");
  let notes = [];
  if (notesFile) {
    const csv = await fetch(notesFile.url).then(r => r.text());
    const lines = csv.split("\n").slice(1);
    notes = lines
      .map(l => l.split(","))
      .filter(p => p.length >= 4)
      .map(p => ({
        user_id: p[0],
        matiere: p[1],
        note: p[2],
        coef: p[3],
      }));
  }

  return NextResponse.json({ users, notes });
}
