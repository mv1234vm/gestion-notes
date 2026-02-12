import "./globals.css";

export const metadata = {
  title: "Gestion Notes",
  description: "Application de gestion des notes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <header>
          <h1><a href="/">Gestion Notes</a></h1>
          <nav>
            <ul>
              <li><a href="/register">Créer un élève</a></li>
              <li><a href="/notes">Notes</a></li>
              <li><a href="/admin">Admin</a></li>
            </ul>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
