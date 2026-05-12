"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const concepts = [
  { slug: "miraj",   label: "Mi'raj"  },
  { slug: "bab",     label: "Bab"     },
  { slug: "mizan",   label: "Mizan"   },
  { slug: "sakinah", label: "Sakinah" },
  { slug: "tawaf",   label: "Tawaf"   },
  { slug: "noor",    label: "Noor"    },
];

export function ConceptSwitcher({ theme = "light" }: { theme?: "light" | "dark" }) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "en";

  const base =
    theme === "dark"
      ? "bg-white/10 text-white/80 backdrop-blur ring-white/15"
      : "bg-white text-neutral-700 ring-black/5 shadow-md";
  const active =
    theme === "dark" ? "bg-white text-black" : "bg-neutral-900 text-white";

  return (
    <nav
      className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full ${base} px-1.5 py-1.5 ring-1`}
      aria-label="Concept switcher"
    >
      <Link
        href={`/${locale}/concepts`}
        className="rounded-full px-3 py-1.5 text-xs opacity-70 transition-opacity hover:opacity-100"
      >
        ← All
      </Link>
      {concepts.map((c) => {
        const isActive = pathname.endsWith(`/concepts/${c.slug}`);
        return (
          <Link
            key={c.slug}
            href={`/${locale}/concepts/${c.slug}`}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              isActive ? active : "opacity-70 hover:opacity-100"
            }`}
          >
            {c.label}
          </Link>
        );
      })}
    </nav>
  );
}
