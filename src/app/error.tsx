"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          backgroundColor: "#090E1B",
          color: "#DDE4F0",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: "0 1rem", maxWidth: "28rem" }}>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              color: "#4F46E5",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Erreur système
          </p>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 900,
              margin: "0 0 0.75rem",
              lineHeight: 1.15,
            }}
          >
            Une erreur inattendue s&apos;est produite.
          </h1>
          <p
            style={{
              color: "#8A96B8",
              marginBottom: "2rem",
              lineHeight: 1.6,
              fontSize: "0.9rem",
            }}
          >
            {error.message || "Veuillez réessayer ultérieurement."}
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#4F46E5",
              color: "#fff",
              fontWeight: 700,
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4338CA";
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4F46E5";
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
