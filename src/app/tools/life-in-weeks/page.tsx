import type { Metadata } from "next";
import LifeInWeeksCalculator from "./Calculator";

export const metadata: Metadata = {
  title: "Life in Weeks Tool — Life Economics",
  description:
    "See how many weeks you have lived and how many you may have left using actuarial life expectancy data.",
};

export default function LifeInWeeksPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-navy-900">Life in Weeks</h1>
      <p className="text-navy-700 mt-3 leading-relaxed max-w-3xl">
        This tool turns life expectancy into something visual and tangible. Enter your birth month, year, gender,
        and state to see how many weeks you have likely lived and how many may still be ahead. The estimate uses
        national SSA life tables and state-level CDC adjustments.
      </p>

      <LifeInWeeksCalculator />

      <p className="text-navy-500 text-sm mt-8 max-w-3xl">
        This is a directional estimate, not a prediction. Real outcomes vary by health, lifestyle, and countless
        factors. Use this as a perspective tool to make time feel more real.
      </p>
    </section>
  );
}
