"use client";

import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calculateMortgage, type Period } from "@/lib/mortgage";

function fmt(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function fmtPrecise(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const inputClass =
  "mt-1 block w-full rounded border border-sage-300 bg-white px-3 py-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-flame-400";

function PeriodToggle({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className="mt-2 flex rounded border border-sage-300 overflow-hidden text-xs font-semibold">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={`flex-1 px-2 py-1.5 transition-colors ${
          value === "monthly" ? "bg-navy-900 text-white" : "bg-white text-navy-700 hover:bg-sage-100"
        }`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={`flex-1 px-2 py-1.5 transition-colors ${
          value === "yearly" ? "bg-navy-900 text-white" : "bg-white text-navy-700 hover:bg-sage-100"
        }`}
      >
        Yearly
      </button>
    </div>
  );
}

export default function MortgageCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(400_000);
  const [downPayment, setDownPayment] = useState(80_000);
  const [annualRate, setAnnualRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [propertyTax, setPropertyTax] = useState(6_000);
  const [propertyTaxPeriod, setPropertyTaxPeriod] = useState<Period>("yearly");
  const [insurance, setInsurance] = useState(1_200);
  const [insurancePeriod, setInsurancePeriod] = useState<Period>("yearly");
  const [includePmi, setIncludePmi] = useState(false);
  const [monthlyPmi, setMonthlyPmi] = useState(150);
  const [includeHoa, setIncludeHoa] = useState(false);
  const [monthlyHoa, setMonthlyHoa] = useState(250);

  const result = useMemo(
    () =>
      calculateMortgage({
        purchasePrice,
        downPayment,
        annualRate,
        termYears,
        propertyTax,
        propertyTaxPeriod,
        insurance,
        insurancePeriod,
        includePmi,
        monthlyPmi,
        includeHoa,
        monthlyHoa,
      }),
    [
      purchasePrice,
      downPayment,
      annualRate,
      termYears,
      propertyTax,
      propertyTaxPeriod,
      insurance,
      insurancePeriod,
      includePmi,
      monthlyPmi,
      includeHoa,
      monthlyHoa,
    ]
  );

  const chartData = result.yearlySchedule.map((y) => ({
    year: y.year,
    principal: y.principalPaid,
    interest: y.interestPaid,
    remainingBalance: y.remainingBalance,
    totalYear: y.totalPaid,
  }));

  const yearOne = result.yearlySchedule[0];

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Purchase Price</span>
          <input
            type="number"
            min={0}
            step={1000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Down Payment</span>
          <input
            type="number"
            min={0}
            step={1000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className={inputClass}
          />
          <p className="text-xs text-navy-500 mt-1">
            {result.downPaymentPercent.toFixed(1)}% down · Loan: {fmt(result.loanAmount)}
          </p>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Mortgage Rate (%)</span>
          <input
            type="number"
            min={0}
            max={20}
            step={0.125}
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Loan Term (Years)</span>
          <input
            type="number"
            min={1}
            max={40}
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Property Taxes</span>
          <input
            type="number"
            min={0}
            value={propertyTax}
            onChange={(e) => setPropertyTax(Number(e.target.value))}
            className={inputClass}
          />
          <PeriodToggle value={propertyTaxPeriod} onChange={setPropertyTaxPeriod} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Homeowners Insurance</span>
          <input
            type="number"
            min={0}
            value={insurance}
            onChange={(e) => setInsurance(Number(e.target.value))}
            className={inputClass}
          />
          <PeriodToggle value={insurancePeriod} onChange={setInsurancePeriod} />
        </label>
        <label className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={includePmi}
            onChange={(e) => setIncludePmi(e.target.checked)}
            className="h-4 w-4 rounded border-sage-400 text-flame-600 focus:ring-flame-400"
          />
          <span className="text-sm font-semibold text-navy-700">Include PMI</span>
        </label>
        <label className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={includeHoa}
            onChange={(e) => setIncludeHoa(e.target.checked)}
            className="h-4 w-4 rounded border-sage-400 text-flame-600 focus:ring-flame-400"
          />
          <span className="text-sm font-semibold text-navy-700">Include HOA fees</span>
        </label>
        {includePmi && (
          <label className="block">
            <span className="text-sm font-semibold text-navy-700">Monthly PMI</span>
            <input
              type="number"
              min={0}
              value={monthlyPmi}
              onChange={(e) => setMonthlyPmi(Number(e.target.value))}
              className={inputClass}
            />
            {result.downPaymentPercent < 20 && (
              <p className="text-xs text-navy-500 mt-1">
                PMI is often required when your down payment is under 20%.
              </p>
            )}
          </label>
        )}
        {includeHoa && (
          <label className="block">
            <span className="text-sm font-semibold text-navy-700">Monthly HOA</span>
            <input
              type="number"
              min={0}
              value={monthlyHoa}
              onChange={(e) => setMonthlyHoa(Number(e.target.value))}
              className={inputClass}
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border border-sage-300 rounded-lg p-5 text-center min-h-[120px] flex flex-col justify-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">Total Monthly Payment</p>
          <p className="text-xl lg:text-2xl font-bold text-flame-600 mt-2 leading-tight">
            {fmtPrecise(result.monthlyTotal)}
          </p>
        </div>
        <div className="bg-white border border-sage-300 rounded-lg p-5 text-center min-h-[120px] flex flex-col justify-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">Principal &amp; Interest</p>
          <p className="text-xl lg:text-2xl font-bold text-navy-900 mt-2 leading-tight">
            {fmtPrecise(result.monthlyPi)}
          </p>
        </div>
        <div className="bg-white border border-sage-300 rounded-lg p-5 text-center min-h-[120px] flex flex-col justify-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">Taxes, Insurance &amp; Fees</p>
          <p className="text-xl lg:text-2xl font-bold text-navy-900 mt-2 leading-tight">
            {fmtPrecise(
              result.monthlyTax + result.monthlyInsurance + result.monthlyPmi + result.monthlyHoa
            )}
          </p>
        </div>
        <div className="bg-white border border-sage-300 rounded-lg p-5 text-center min-h-[120px] flex flex-col justify-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">Total Interest (Life of Loan)</p>
          <p className="text-xl lg:text-2xl font-bold text-navy-900 mt-2 leading-tight">
            {fmt(result.totalInterest)}
          </p>
        </div>
      </div>

      <div className="mt-4 bg-sage-100 border border-sage-300 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-navy-800">First payment breakdown</h3>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-navy-700">
          <p>
            <span className="font-semibold text-navy-900">Principal:</span>{" "}
            {fmtPrecise(result.firstMonth.principal)}
          </p>
          <p>
            <span className="font-semibold text-navy-900">Interest:</span>{" "}
            {fmtPrecise(result.firstMonth.interest)}
          </p>
          <p>
            <span className="font-semibold text-navy-900">Remaining balance:</span>{" "}
            {fmt(result.firstMonth.balance)}
          </p>
        </div>
      </div>

      {yearOne && (
        <div className="mt-4 bg-white border border-sage-300 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-navy-800">Year 1 totals</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-navy-700">
            <p>
              <span className="font-semibold text-navy-900">Principal paid:</span> {fmt(yearOne.principalPaid)}
            </p>
            <p>
              <span className="font-semibold text-navy-900">Interest paid:</span> {fmt(yearOne.interestPaid)}
            </p>
            <p>
              <span className="font-semibold text-navy-900">All-in (P&amp;I + escrow):</span>{" "}
              {fmt(yearOne.totalPaid)}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 bg-white border border-sage-300 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-navy-800">
          {termYears}-year loan summary
        </h3>
        <p className="text-xs text-navy-500 mt-1">Total principal and interest over the full loan term</p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-navy-700">
          <p>
            <span className="font-semibold text-navy-900">Total principal paid:</span>{" "}
            {fmt(result.totalPrincipal)}
          </p>
          <p>
            <span className="font-semibold text-navy-900">Total interest paid:</span>{" "}
            {fmt(result.totalInterest)}
          </p>
          <p>
            <span className="font-semibold text-navy-900">Total mortgage payments:</span>{" "}
            {fmt(result.totalPiPayments)}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white border border-sage-300 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-navy-800 mb-1">Loan payoff over time</h3>
        <p className="text-xs text-navy-500 mb-4">
          Annual principal vs. interest (left axis) and remaining balance (right axis)
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c8d4b8" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12 }}
              label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 12 }}
            />
            <YAxis
              yAxisId="pay"
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="balance"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip formatter={(value) => fmt(Number(value))} labelFormatter={(label) => `Year ${label}`} />
            <Legend />
            <Area
              yAxisId="pay"
              type="monotone"
              dataKey="principal"
              stackId="pay"
              stroke="#273c69"
              fill="#b3c1df"
              name="Principal (annual)"
            />
            <Area
              yAxisId="pay"
              type="monotone"
              dataKey="interest"
              stackId="pay"
              stroke="#c45a0a"
              fill="#fdd9a8"
              name="Interest (annual)"
            />
            <Line
              yAxisId="balance"
              type="monotone"
              dataKey="remainingBalance"
              stroke="#2f855a"
              strokeWidth={2}
              dot={false}
              name="Remaining balance"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
