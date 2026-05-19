import type { Metadata } from "next";
import MortgageCalculator from "./Calculator";

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator — Life Economics",
  description:
    "Estimate monthly mortgage payments with principal, interest, taxes, insurance, and optional PMI. See amortization and balance over time.",
};

export default function MortgageCalculatorPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-navy-900">Mortgage Payment Calculator</h1>
      <p className="text-navy-700 mt-3 leading-relaxed max-w-3xl">
        Buying a home means more than the sticker price. This calculator breaks down your estimated monthly
        payment — principal, interest, property taxes, insurance, and optional PMI — and shows how your loan
        balance shrinks over time.
      </p>

      <MortgageCalculator />

      <p className="text-navy-500 text-sm mt-8 max-w-3xl">
        Estimates assume a fixed-rate loan with monthly payments. Actual lender quotes, escrow requirements, and
        PMI rules vary. Use this as a planning tool, not a loan offer.{" "}
        <a
          href="https://lifeeconomics.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-flame-600 underline hover:text-flame-700"
        >
          Read the newsletter
        </a>{" "}
        for more on housing decisions and the true cost of ownership.
      </p>
    </section>
  );
}
