import Link from "next/link";

// Fallback 404 locale-less. Root layout = passthrough (tanpa <html>/<body>),
// jadi halaman ini menyediakan dokumennya sendiri + style inline (globals.css
// tidak dimuat di luar [locale]/layout). Hampir tak pernah terpicu: middleware
// mengarahkan semua path ke /id atau /en, lalu [locale]/not-found.tsx (terlokalisasi)
// menangani 404 normal. Ini hanya jaring pengaman untuk segmen locale invalid.
export default function RootNotFound() {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#fff",
          color: "#111",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "5rem", fontWeight: 700, opacity: 0.2 }}>
            404
          </div>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>
            Halaman Tidak Ditemukan / Page Not Found
          </h1>
          <p style={{ color: "#555", maxWidth: 480 }}>
            Maaf, halaman yang Anda cari tidak ada. Sorry, the page you are
            looking for does not exist.
          </p>
          <Link
            href="/"
            style={{
              color: "#fff",
              background: "#000",
              padding: "0.6rem 1.2rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
            }}
          >
            Kembali ke Beranda / Back to Home
          </Link>
        </main>
      </body>
    </html>
  );
}
