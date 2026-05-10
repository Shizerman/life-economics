import Link from "next/link";
import Image from "next/image";
import { resources } from "@/lib/resources";
import ResourceCard from "@/components/ResourceCard";

export default function HomePage() {
  // Show every resource on the homepage so new tools are always visible
  // (previously slice(0, 3) hid the 4th item and confused anyone scanning the grid).
  const featured = resources;

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-950 text-white py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-[140px] h-[140px] mx-auto rounded-full overflow-hidden mb-6">
            <Image
              src="/logo.png"
              alt="Life Economics logo"
              width={140}
              height={140}
              className="scale-[1.15] -translate-x-[1px]"
            />
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">
            Life Economics
          </h1>
          <p className="mt-1 text-sm text-flame-400 font-semibold tracking-widest uppercase">
            Sapientia &middot; Audacia &middot; Aedifica Futurum Hodie
          </p>
          <p className="mt-4 text-lg text-navy-200 leading-relaxed max-w-2xl mx-auto">
            Practical tools and straightforward thinking about money, decisions,
            and building a life that actually works. No jargon, no fluff — just
            the stuff that matters.
          </p>
          <a
            href="https://lifeeconomics.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 bg-flame-500 hover:bg-flame-600 text-white font-semibold px-6 py-3 rounded-lg text-lg transition-colors"
          >
            Subscribe to the Newsletter
          </a>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-navy-900">
            Latest Resources
          </h2>
          <Link
            href="/resources"
            className="text-sm font-semibold text-flame-600 hover:text-flame-700"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {featured.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sage-200 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-bold text-navy-900">
            Want more?
          </h2>
          <p className="text-navy-700 mt-2">
            The newsletter is where the real thinking happens. New articles every
            week on the economics of everyday life.
          </p>
          <a
            href="https://lifeeconomics.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Read on Substack
          </a>
        </div>
      </section>
    </>
  );
}
