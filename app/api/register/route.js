import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { generateUserId } from "@/lib/generateUserId";

export async function POST(req) {
  const { nom, prenom, classe } = await req.json();

  if (!nom || !prenom || !classe) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const user_id = generateUserId(classe, prenom, nom);

  // Récupérer users.csv s’il existe
  const files = await list();
  const file = files.blobs.find(b => b.pathname === "users.csv");

  let csv = "user_id,nom,prenom,classe\n";

  if (file) {
    const existing = await fetch(file.url).then(r => r.text());
    csv = existing;
  }

  // Ajouter la ligne
  const line = `${user_id},${nom},${prenom},${classe}\n`;
  const updated = csv + line;

  await put("users.csv", updated, {
    access: "public",
    contentType: "text/csv",
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return NextResponse.json({
    ok: true,
    user_id,
    notesUrl: `${baseUrl}/notes?u=${user_id}`,
  });
}
