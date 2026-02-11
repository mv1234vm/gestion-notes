export function generateUserId(classe, prenom, nom) {
  const c = classe.toLowerCase().replace(/\s+/g, "");
  const p = prenom.toLowerCase().trim();
  const n = nom.toLowerCase().trim();

  const initialPrenom = p[0] || "";
  const initialNom = n[0] || "";
  const deuxLettresNom = n.slice(1, 3) || "";

  return `${c}${initialPrenom}${initialNom}${deuxLettresNom}`;
}
