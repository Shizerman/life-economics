"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function CompoundInterestCalculator() {
  const [startingAmount, setStartingAmount] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [annualRate, setAnnualRate] = useState(7);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [comparisonRate, setComparisonRate] = useState(10);
  const [years, setYears] = useState(20);

  const {
    chartData,
    finalBalance,
    comparisonFinalBalance,
    totalContributed,
    totalInterest,
    comparisonInterest,
  } = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    const comparisonMonthlyRate = comparisonRate / 100 / 12;
    const months = years * 12;
    let balance = startingAmount;
    let comparisonBalance = startingAmount;
    const data: {
      year: number;
      balance: number;
      contributed: number;
      comparisonBalance: number;
    }[] = [];

    // Year 0
    data.push({
      year: 0,
      balance: startingAmount,
      contributed: startingAmount,
      comparisonBalance: startingAmount,
    });

    for (let m = 1; m <= months; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      comparisonBalance = comparisonBalance * (1 + comparisonMonthlyRate) + monthlyContribution;
      if (m % 12 === 0) {
        const contributed = startingAmount + monthlyContribution * m;
        data.push({
          year: m / 12,
          balance: Math.round(balance),
          contributed: Math.round(contributed),
          comparisonBalance: Math.round(comparisonBalance),
        });
      }
    }

    const totalContributed = startingAmount + monthlyContribution * months;
    return {
      chartData: data,
      finalBalance: Math.round(balance),
      comparisonFinalBalance: Math.round(comparisonBalance),
      totalContributed: Math.round(totalContributed),
      totalInterest: Math.round(balance - totalContributed),
      comparisonInterest: Math.round(comparisonBalance - totalContributed),
    };
  }, [startingAmount, monthlyContribution, annualRate, comparisonRate, years]);

  return (
    <div className="mt-8">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Starting Amount</span>
          <input
            type="number"
            min={0}
            value={startingAmount}
            onChange={(e) => setStartingAmount(Number(e.target.value))}
            className="mt-1 block w-full rounded border border-sage-300 bg-white px-3 py-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-flame-400"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Monthly Contribution</span>
          <input
            type="number"
            min={0}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="mt-1 block w-full rounded border border-sage-300 bg-white px-3 py-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-flame-400"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Annual Interest Rate (%)</span>
          <input
            type="number"
            min={0}
            max={30}
            step={0.1}
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="mt-1 block w-full rounded border border-sage-300 bg-white px-3 py-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-flame-400"
          />
        </label>
        <label className="flex items-center gap-2 mt-7">
          <input
            type="checkbox"
            checked={compareEnabled}
            onChange={(e) => setCompareEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-sage-400 text-flame-600 focus:ring-flame-400"
          />
          <span className="text-sm font-semibold text-navy-700">Compare another interest rate</span>
        </label>
        {compareEnabled && (
          <label className="block">
            <span className="text-sm font-semibold text-navy-700">Comparison Interest Rate (%)</span>
            <input
              type="number"
              min={0}
              max={30}
              step={0.1}
              value={comparisonRate}
              onChange={(e) => setComparisonRate(Number(e.target.value))}
              className="mt-1 block w-full rounded border border-sage-300 bg-white px-3 py-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-flame-400"
            />
          </label>
        )}
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Time Horizon (Years)</span>
          <input
            type="number"
            min={1}
            max={50}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-1 block w-full rounded border border-sage-300 bg-white px-3 py-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-flame-400"
          />
        </label>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-sage-300 rounded-lg p-5 text-center min-w-0 overflow-hidden min-h-[120px] flex flex-col justify-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">Total Contributed</p>
          <p className="text-xl lg:text-2xl font-bold text-navy-900 mt-2 leading-tight">
            {fmt(totalContributed)}
          </p>
        </div>
        <div className="bg-white border border-sage-300 rounded-lg p-5 text-center min-w-0 overflow-hidden min-h-[120px] flex flex-col justify-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">Interest Earned</p>
          <p className="text-xl lg:text-2xl font-bold text-flame-600 mt-2 leading-tight">
            {fmt(totalInterest)}
          </p>
        </div>
        <div className="bg-white border border-sage-300 rounded-lg p-5 text-center min-w-0 overflow-hidden min-h-[120px] flex flex-col justify-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">Final Balance</p>
          <p className="text-xl lg:text-2xl font-bold text-navy-900 mt-2 leading-tight">
            {fmt(finalBalance)}
          </p>
        </div>
      </div>
      {compareEnabled && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-white border border-sage-300 rounded-lg p-5 text-center min-w-0 overflow-hidden min-h-[120px] flex flex-col justify-center">
            <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">
              Interest Earned @ {comparisonRate}%
            </p>
            <p className="text-xl lg:text-2xl font-bold text-navy-900 mt-2 leading-tight">
              {fmt(comparisonInterest)}
            </p>
          </div>
          <div className="bg-white border border-sage-300 rounded-lg p-5 text-center min-w-0 overflow-hidden min-h-[120px] flex flex-col justify-center">
            <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">
              Final Balance @ {comparisonRate}%
            </p>
            <p className="text-xl lg:text-2xl font-bold text-navy-900 mt-2 leading-tight">
              {fmt(comparisonFinalBalance)}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="mt-8 bg-white border border-sage-300 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c8d4b8" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12 }}
              label={{ value: "Years", position: "insideBottom", offset: -2, fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => fmt(Number(value))}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="contributed"
              stackId="1"
              stroke="#273c69"
              fill="#b3c1df"
              name="Contributed"
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#c45a0a"
              fill="#fdd9a8"
              name={`Balance @ ${annualRate}%`}
            />
            {compareEnabled && (
              <Line
                type="monotone"
                dataKey="comparisonBalance"
                stroke="#2f855a"
                strokeWidth={2}
                dot={false}
                name={`Balance @ ${comparisonRate}%`}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
