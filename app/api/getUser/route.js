import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("u");

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const files = await list();
  const file = files.blobs.find(b => b.pathname === "users.csv");

  if (!file) {
    return NextResponse.json({ error: "users.csv not found" }, { status: 404 });
  }

  const csv = await fetch(file.url).then(r => r.text());
  const lines = csv.split("\n").slice(1);

  const userLine = lines
    .map(l => l.split(","))
    .find(p => p[0] === user_id);

  if (!userLine) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user_id: userLine[0],
    nom: userLine[1],
    prenom: userLine[2],
    classe: userLine[3],
  });
}
