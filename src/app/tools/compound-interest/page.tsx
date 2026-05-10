// App Router page for the compound interest interactive tool.
import type { Metadata } from "next";
import CompoundInterestCalculator from "./Calculator";

export const metadata: Metadata = {
  title: "Compound Interest Calculator — Life Economics",
  description:
    "See how your money grows over time. Adjust starting amount, contributions, interest rate, and time horizon.",
};

export default function CompoundInterestPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-navy-900">
        Compound Interest Calculator
      </h1>
      <p className="text-navy-700 mt-3 leading-relaxed">
        Compound interest is what happens when your money earns returns — and
        then those returns start earning returns too. It&apos;s the single most
        powerful force in long-term wealth building, and the earlier you start,
        the more dramatic the effect. Use this calculator to see how consistent
        contributions and time can turn modest savings into serious money.
      </p>

      <CompoundInterestCalculator />

      <p className="text-navy-500 text-sm mt-8">
        This calculator assumes interest compounds monthly. Real-world returns
        vary — use this as a directional tool, not a guarantee.{" "}
        <a
          href="https://lifeeconomics.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-flame-600 underline hover:text-flame-700"
        >
          Read the newsletter
        </a>{" "}
        for deeper context on how to think about investing and compound growth.
      </p>
    </section>
  );
}
