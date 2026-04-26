import { resources } from "@/lib/resources";
import ResourceCard from "@/components/ResourceCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources & Tools — Life Economics",
  description: "Free financial calculators, spreadsheets, and guides from Life Economics.",
};

export default function ResourcesPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-navy-900">
        Resources & Tools
      </h1>
      <p className="text-navy-700 mt-2 max-w-2xl">
        Free tools and downloads to help you make smarter financial decisions.
        New resources are added regularly — check back or{" "}
        <a
          href="https://lifeeconomics.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-flame-600 underline hover:text-flame-700"
        >
          subscribe to the newsletter
        </a>{" "}
        to stay in the loop.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {resources.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </section>
  );
}
