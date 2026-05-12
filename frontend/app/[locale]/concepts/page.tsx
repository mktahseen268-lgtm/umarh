import Link from "next/link";

const concepts = [
  {
    slug: "miraj",
    name: "Mi'raj",
    tag: "Sky Journey ✈",
    desc: "Scroll = flight. Plane crosses sky as you read. Cinematic.",
    grad: "from-[#ff8c5a] via-[#6a3e7e] to-[#0a0e27]",
    accent: "text-amber-200",
    badge: "New",
  },
  {
    slug: "bab",
    name: "Bab",
    tag: "Spiritual Portal 🌀",
    desc: "WebGL portal shader. Cursor-warped. Pixels are particles.",
    grad: "from-[#08040e] via-[#1b0838] to-[#08040e]",
    accent: "text-amber-200",
    badge: "New",
  },
  {
    slug: "mizan",
    name: "Mizan",
    tag: "Time & Journey ⏳",
    desc: "Horizontal scroll-pinned chapters. Sand flows. Time bends.",
    grad: "from-slate-900 via-amber-900 to-amber-300",
    accent: "text-amber-100",
    badge: "New",
  },
  {
    slug: "sakinah",
    name: "Sakinah",
    tag: "Spiritual Cinematic",
    desc: "Cinema-first scroll storytelling. Animation as emotion.",
    grad: "from-[#0B0F0E] via-[#1A2422] to-[#0B0F0E]",
    accent: "text-[#C9A85B]",
  },
  {
    slug: "tawaf",
    name: "Tawaf",
    tag: "High-Conversion Marketplace",
    desc: "Functional feedback only. Animation as information.",
    grad: "from-emerald-50 via-white to-amber-50",
    accent: "text-emerald-700",
    light: true,
  },
  {
    slug: "noor",
    name: "Noor",
    tag: "Smart AI Platform",
    desc: "Living data. Animation as intelligence.",
    grad: "from-[#0A0A0F] via-indigo-950 to-[#0A0A0F]",
    accent: "text-cyan-300",
  },
];

export default async function ConceptsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Design Previews</p>
        <h1 className="mt-2 text-4xl font-semibold text-neutral-900">Six Umrah concepts</h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          Six distinct motion philosophies. Click to enter. Each one is a complete product
          direction — not a variation of the others.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {concepts.map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/concepts/${c.slug}`}
              className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${c.grad} p-8 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-2xl`}
              style={{ minHeight: 280 }}
            >
              {c.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-black">
                  {c.badge}
                </span>
              )}
              <div className={`flex h-full flex-col justify-between ${c.light ? "text-neutral-900" : "text-white/90"}`}>
                <div>
                  <p className={`text-xs uppercase tracking-widest ${c.accent}`}>{c.tag}</p>
                  <h2 className="mt-2 text-3xl font-semibold">{c.name}</h2>
                </div>
                <div>
                  <p className={`text-sm ${c.light ? "text-neutral-700" : "text-white/70"}`}>{c.desc}</p>
                  <p className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${c.accent}`}>
                    Enter <span className="transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
