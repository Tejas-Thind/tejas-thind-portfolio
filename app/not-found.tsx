import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif font-semibold italic tracking-tight text-foreground mb-4"
        style={{ fontSize: "clamp(6rem, 20vw, 12rem)", lineHeight: 1 }}
      >
        404
      </h1>
      <p className="text-muted-foreground text-base max-w-xs leading-relaxed mb-10">
        This page doesn&apos;t exist yet. Neither did most good ideas.
      </p>
      <Link
        href="/"
        className="text-foreground text-sm font-semibold hover-lift"
        style={{ textShadow: "0 0 0.6px currentColor, 0 0 0.6px currentColor" }}
      >
        Go home
      </Link>
    </div>
  );
}
