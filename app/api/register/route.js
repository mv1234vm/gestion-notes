import { NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

function generateUserId(nom, prenom, classe) {
  const base =
    (classe || "").toLowerCase().replace(/\s+/g, "") +
    (prenom || "").toLowerCase().slice(0, 2) +
    (nom || "").toLowerCase().slice(0, 2);
  const rand = Math.floor(Math.random() * 90 + 10);
  return `${rand}${base}`;
}

export async function POST(req) {
  const { nom, prenom, classe } = await req.json();

  if (!nom || !prenom || !classe) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user_id = generateUserId(nom, prenom, classe);

  const files = await list();
  const file = files.blobs.find(b => b.pathname === "users.csv");

  let csv = "user_id,nom,prenom,classe\n";
  if (file) {
    const existing = await fetch(file.url).then(r => r.text());
    csv = existing;
  }

  const line = `${user_id},${nom},${prenom},${classe}\n`;
  const updated = csv + line;

  await put("users.csv", updated, {
    access: "public",
    contentType: "text/csv",
  });

  return NextResponse.json({
    user_id,
    notesUrl: `/notes?u=${user_id}`,
  });
}
