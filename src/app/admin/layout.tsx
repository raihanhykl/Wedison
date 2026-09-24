// Root layout khusus /admin: TIDAK dilokalisasi, tanpa Navbar/Footer situs publik.
// Menyediakan <html>/<body> sendiri (root app/layout.tsx hanya meneruskan children).
import type { Metadata } from "next";
import { fontVariables } from "@/app/fonts";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { default: "Admin · Wedison", template: "%s · Admin Wedison" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fontVariables} antialiased bg-background text-foreground`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
