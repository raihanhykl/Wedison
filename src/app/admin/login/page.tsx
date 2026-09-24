import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="min-h-svh grid lg:grid-cols-[1.1fr_1fr]">
      {/* Panel brand (desktop) */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-forest text-forest-foreground p-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="relative flex items-center gap-3">
          <Image src="/logo/wedison-wordmark-white.webp" alt="Wedison" width={140} height={36} className="h-8 w-auto" priority />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-forest-muted">Admin</span>
        </div>
        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-bold tracking-tight text-balance">
            One panel for content and the SuperCharge network.
          </h1>
          <p className="mt-4 text-forest-muted leading-relaxed">
            Manage articles, press coverage, social media, the media library and SuperCharge stations. Changes go
            live on wedison.co right away.
          </p>
        </div>
        <p className="relative font-mono text-xs text-forest-muted">© {new Date().getFullYear()} Wedison</p>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Image src="/logo/wedison-wordmark.webp" alt="Wedison" width={140} height={36} className="h-8 w-auto" priority />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Sign in to Admin</h2>
          <p className="mt-1 text-sm text-muted-foreground">Use the account provided by your Super Admin.</p>
          <div className="mt-8">
            <LoginForm next={next} />
          </div>
        </div>
      </main>
    </div>
  );
}
