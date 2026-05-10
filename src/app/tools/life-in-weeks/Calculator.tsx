"use client";

import { useEffect, useMemo, useState } from "react";
import nationalTable from "../../../../docs/actuarial_national.json";
import stateTable from "../../../../docs/actuarial_states.json";

type Gender = "male" | "female";

interface Kid {
  birthYear: string;
  name: string;
}

const MONTHS = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

const YEARS = Array.from({ length: 2025 - 1920 + 1 }, (_, i) => 2025 - i);

const PARENT_YEARS = Array.from({ length: 2006 - 1920 + 1 }, (_, i) => 2006 - i);

const STATES: { abbr: string; name: string }[] = [
  { abbr: "AL", name: "Alabama" },
  { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" },
  { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" },
  { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" },
  { abbr: "DE", name: "Delaware" },
  { abbr: "DC", name: "District of Columbia" },
  { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
];

const VISIT_FREQUENCIES = [
  { label: "Weekly", perYear: 52 },
  { label: "A couple times a month", perYear: 24 },
  { label: "Monthly", perYear: 12 },
  { label: "Every few months", perYear: 4 },
  { label: "A few times a year", perYear: 3 },
  { label: "Once a year", perYear: 1 },
  { label: "Rarely", perYear: 0.5 },
];

const WEEKS_PER_YEAR = 52.1775;
const NATIONAL_AVG: Record<Gender, number> = { male: 74.74, female: 80.18 };
const STORAGE_KEY = "life-in-weeks-v1";

const inputClass =
  "mt-1 block w-full rounded border border-sage-300 bg-white px-3 py-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-flame-400";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function fmt(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

function calcRemainingYears(age: number, gender: Gender, stateAbbr: string): number {
  const safeAge = clamp(age, 0, 100);
  const nationalRemaining =
    (nationalTable[gender] as Record<string, number>)[String(safeAge)] ?? 0;
  const stateLifeExp =
    ((stateTable as { states: Record<string, Record<string, number>> }).states[stateAbbr])?.[
      gender
    ] ?? NATIONAL_AVG[gender];
  const stateAdj = stateLifeExp - NATIONAL_AVG[gender];
  return Math.max(0, nationalRemaining + stateAdj);
}

function getPhaseClass(weekIndex: number, livedWeeks: number, isCurrentWeek: boolean): string {
  if (isCurrentWeek) return "ring-1 ring-inset ring-navy-900 bg-white";
  const yearAtWeek = weekIndex / WEEKS_PER_YEAR;
  const lived = weekIndex < livedWeeks;
  if (yearAtWeek < 20) return lived ? "bg-flame-500" : "bg-flame-100";
  if (yearAtWeek < 40) return lived ? "bg-navy-700" : "bg-navy-100";
  if (yearAtWeek < 60) return lived ? "bg-sage-500" : "bg-sage-200";
  if (yearAtWeek < 80) return lived ? "bg-flame-700" : "bg-flame-200";
  return lived ? "bg-navy-900" : "bg-gray-200";
}

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 border border-sage-300 rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-sage-50 hover:bg-sage-100 text-left transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-navy-800">{title}</span>
        <span className="text-xl text-navy-500 leading-none select-none">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-4 py-4 bg-white border-t border-sage-200">{children}</div>
      )}
    </div>
  );
}

function StatResult({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-sage-50 border border-sage-300 rounded-lg p-4 mt-4">
      <p className="text-sm text-navy-600">{label}</p>
      <p className="text-2xl font-bold text-navy-900 mt-1">{value}</p>
      {sub && <p className="text-sm text-navy-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function LifeInWeeksCalculator() {
  const [birthMonth, setBirthMonth] = useState(0);
  const [birthYear, setBirthYear] = useState(1990);
  const [gender, setGender] = useState<Gender>("male");
  const [userState, setUserState] = useState("CA");

  const [p1Year, setP1Year] = useState("");
  const [p1Gender, setP1Gender] = useState<Gender>("male");
  const [p1State, setP1State] = useState("CA");
  const [p2Year, setP2Year] = useState("");
  const [p2Gender, setP2Gender] = useState<Gender>("female");
  const [p2State, setP2State] = useState("CA");
  const [visitFreqPerYear, setVisitFreqPerYear] = useState(3);

  const [kids, setKids] = useState<Kid[]>([]);
  const [kidsLeaveAge, setKidsLeaveAge] = useState(18);

  const [adventuresPerYear, setAdventuresPerYear] = useState(2);
  const [retirementAge, setRetirementAge] = useState(65);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const d = JSON.parse(saved);
      if (d.birthMonth != null) setBirthMonth(d.birthMonth);
      if (d.birthYear) setBirthYear(d.birthYear);
      if (d.gender) setGender(d.gender);
      if (d.userState) setUserState(d.userState);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ birthMonth, birthYear, gender, userState })
      );
    } catch {}
  }, [birthMonth, birthYear, gender, userState]);

  const result = useMemo(() => {
    const now = new Date();
    const birthDate = new Date(birthYear, birthMonth, 1);
    const msDiff = now.getTime() - birthDate.getTime();
    const livedWeeks = Math.max(0, Math.floor(msDiff / (7 * 24 * 60 * 60 * 1000)));

    let age = now.getFullYear() - birthYear;
    if (now.getMonth() < birthMonth) age -= 1;
    age = clamp(age, 0, 100);

    const remainingYears = calcRemainingYears(age, gender, userState);
    const estimatedTotalYears = age + remainingYears;
    const totalEstimatedWeeks = Math.round(estimatedTotalYears * WEEKS_PER_YEAR);
    const remainingWeeks = Math.max(0, totalEstimatedWeeks - livedWeeks);
    const livedPercent =
      totalEstimatedWeeks > 0 ? (livedWeeks / totalEstimatedWeeks) * 100 : 0;
    const estimatedEndYear = now.getFullYear() + Math.round(remainingYears);
    const safeTotalWeeks = clamp(totalEstimatedWeeks, 52, 6500);

    return {
      age,
      livedWeeks,
      remainingWeeks,
      remainingYears,
      livedPercent,
      estimatedEndYear,
      totalWeeks: safeTotalWeeks,
    };
  }, [birthMonth, birthYear, gender, userState]);

  const parentStats = useMemo(() => {
    const now = new Date();
    const parents: { label: string; weeksLeft: number; visitsLeft: number }[] = [];
    const entries: [string, Gender, string][] = [
      [p1Year, p1Gender, p1State],
      [p2Year, p2Gender, p2State],
    ];
    entries.forEach(([yearStr, pg, ps], i) => {
      if (!yearStr) return;
      const pAge = clamp(now.getFullYear() - Number(yearStr), 0, 100);
      const pRemainingYears = calcRemainingYears(pAge, pg, ps);
      const pWeeks = Math.round(pRemainingYears * WEEKS_PER_YEAR);
      const weeksLeft = Math.max(0, Math.min(pWeeks, result.remainingWeeks));
      const visitsLeft = Math.round((weeksLeft / WEEKS_PER_YEAR) * visitFreqPerYear);
      parents.push({ label: `Parent ${i + 1}`, weeksLeft, visitsLeft });
    });
    return parents;
  }, [p1Year, p1Gender, p1State, p2Year, p2Gender, p2State, visitFreqPerYear, result.remainingWeeks]);

  const kidStats = useMemo(() => {
    return kids
      .map((kid, i) => {
        if (!kid.birthYear) return null;
        const now = new Date();
        const kidAge = now.getFullYear() - Number(kid.birthYear);
        const weeksUntilLeaves = Math.max(0, (kidsLeaveAge - kidAge) * WEEKS_PER_YEAR);
        return {
          name: kid.name || `Child ${i + 1}`,
          weeksLeft: Math.round(Math.min(weeksUntilLeaves, result.remainingWeeks)),
          alreadyLeft: kidAge >= kidsLeaveAge,
        };
      })
      .filter(Boolean) as { name: string; weeksLeft: number; alreadyLeft: boolean }[];
  }, [kids, kidsLeaveAge, result.remainingWeeks]);

  const activityStats = useMemo(() => {
    const yearsRemaining = result.remainingWeeks / WEEKS_PER_YEAR;
    return {
      summers: Math.floor(yearsRemaining),
      thanksgivings: Math.floor(yearsRemaining),
      adventures: Math.round(yearsRemaining * adventuresPerYear),
      workWeeks: Math.max(0, Math.round((retirementAge - result.age) * 50)),
    };
  }, [result.remainingWeeks, result.age, adventuresPerYear, retirementAge]);

  function addKid() {
    if (kids.length >= 3) return;
    setKids([...kids, { birthYear: "", name: "" }]);
  }

  function removeKid(index: number) {
    setKids(kids.filter((_, i) => i !== index));
  }

  function updateKid(index: number, field: keyof Kid, value: string) {
    setKids(kids.map((k, i) => (i === index ? { ...k, [field]: value } : k)));
  }

  return (
    <div className="mt-8">
      {/* Core inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Birth Month</span>
          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(Number(e.target.value))}
            className={inputClass}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Birth Year</span>
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
            className={inputClass}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-navy-700">Gender</span>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className={inputClass}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-navy-700">State</span>
          <select
            value={userState}
            onChange={(e) => setUserState(e.target.value)}
            className={inputClass}
          >
            {STATES.map((s) => (
              <option key={s.abbr} value={s.abbr}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Core stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border border-sage-300 rounded-lg p-4 text-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">
            Weeks Lived
          </p>
          <p className="text-2xl font-bold text-navy-900 mt-1">
            {fmt(result.livedWeeks)}
          </p>
        </div>
        <div className="bg-white border border-sage-300 rounded-lg p-4 text-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">
            Weeks Remaining (Est.)
          </p>
          <p className="text-2xl font-bold text-flame-600 mt-1">
            {fmt(result.remainingWeeks)}
          </p>
        </div>
        <div className="bg-white border border-sage-300 rounded-lg p-4 text-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">
            % Life Lived
          </p>
          <p className="text-2xl font-bold text-navy-900 mt-1">
            {result.livedPercent.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white border border-sage-300 rounded-lg p-4 text-center">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">
            Estimated End Year
          </p>
          <p className="text-2xl font-bold text-navy-900 mt-1">
            {result.estimatedEndYear}
          </p>
        </div>
      </div>

      {/* Time with Parents */}
      <CollapsibleSection title="Time with Parents">
        <div className="space-y-6">
          {/* Parent 1 */}
          <div>
            <p className="text-sm font-semibold text-navy-700 mb-3">Parent 1</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-sm text-navy-600">Birth Year</span>
                <select
                  value={p1Year}
                  onChange={(e) => setP1Year(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select year</option>
                  {PARENT_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-navy-600">Gender</span>
                <select
                  value={p1Gender}
                  onChange={(e) => setP1Gender(e.target.value as Gender)}
                  className={inputClass}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-navy-600">State</span>
                <select
                  value={p1State}
                  onChange={(e) => setP1State(e.target.value)}
                  className={inputClass}
                >
                  {STATES.map((s) => (
                    <option key={s.abbr} value={s.abbr}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Parent 2 */}
          <div>
            <p className="text-sm font-semibold text-navy-700 mb-3">
              Parent 2{" "}
              <span className="font-normal text-navy-400">(optional)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-sm text-navy-600">Birth Year</span>
                <select
                  value={p2Year}
                  onChange={(e) => setP2Year(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select year</option>
                  {PARENT_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-navy-600">Gender</span>
                <select
                  value={p2Gender}
                  onChange={(e) => setP2Gender(e.target.value as Gender)}
                  className={inputClass}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-navy-600">State</span>
                <select
                  value={p2State}
                  onChange={(e) => setP2State(e.target.value)}
                  className={inputClass}
                >
                  {STATES.map((s) => (
                    <option key={s.abbr} value={s.abbr}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Visit frequency */}
          <label className="block max-w-xs">
            <span className="text-sm font-semibold text-navy-700">
              How often do you see them?
            </span>
            <select
              value={visitFreqPerYear}
              onChange={(e) => setVisitFreqPerYear(Number(e.target.value))}
              className={inputClass}
            >
              {VISIT_FREQUENCIES.map((f) => (
                <option key={f.label} value={f.perYear}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          {/* Results */}
          {parentStats.length === 0 && (
            <p className="text-sm text-navy-400 mt-2">
              Enter at least one parent&apos;s birth year to see results.
            </p>
          )}
          {parentStats.map((p) => (
            <StatResult
              key={p.label}
              label={`Estimated weeks left with ${p.label}`}
              value={fmt(p.weeksLeft)}
              sub={`At ${visitFreqPerYear} visit${visitFreqPerYear === 1 ? "" : "s"} per year — about ${fmt(p.visitsLeft)} visits remaining`}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Time with Kids */}
      <CollapsibleSection title="Time with Kids at Home">
        <div className="space-y-4">
          {kids.map((kid, i) => (
            <div key={i} className="border border-sage-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-navy-700">
                  Child {i + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeKid(i)}
                  className="text-xs text-navy-400 hover:text-flame-600 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm text-navy-600">Birth Year</span>
                  <select
                    value={kid.birthYear}
                    onChange={(e) => updateKid(i, "birthYear", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 2025 - 1990 + 1 }, (_, j) => 2025 - j).map(
                      (y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      )
                    )}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-navy-600">
                    Name{" "}
                    <span className="font-normal text-navy-400">(optional)</span>
                  </span>
                  <input
                    type="text"
                    value={kid.name}
                    onChange={(e) => updateKid(i, "name", e.target.value)}
                    placeholder="e.g. Emma"
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          ))}

          {kids.length < 3 && (
            <button
              type="button"
              onClick={addKid}
              className="text-sm font-semibold text-flame-600 hover:text-flame-700 transition-colors"
            >
              + Add a child
            </button>
          )}

          {kids.length > 0 && (
            <label className="block max-w-xs mt-2">
              <span className="text-sm font-semibold text-navy-700">
                Age they leave home
              </span>
              <input
                type="number"
                min={1}
                max={30}
                value={kidsLeaveAge}
                onChange={(e) => setKidsLeaveAge(Number(e.target.value))}
                className={inputClass}
              />
            </label>
          )}

          {kids.length === 0 && (
            <p className="text-sm text-navy-400">
              Add a child to see how many weeks you have left together at home.
            </p>
          )}

          {kidStats.map((k) =>
            k.alreadyLeft ? (
              <StatResult
                key={k.name}
                label={`${k.name} has already left home`}
                value="—"
              />
            ) : (
              <StatResult
                key={k.name}
                label={`Estimated weeks left with ${k.name} at home`}
                value={fmt(k.weeksLeft)}
                sub={`About ${(k.weeksLeft / WEEKS_PER_YEAR).toFixed(1)} years`}
              />
            )
          )}

          {kidStats.length > 1 && (
            <StatResult
              label="Weeks until your last child leaves home"
              value={fmt(Math.max(...kidStats.map((k) => k.weeksLeft)))}
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Adventures & More */}
      <CollapsibleSection title="Adventures & More Stats">
        <div className="space-y-6">
          {/* Adventures */}
          <div>
            <p className="text-sm font-semibold text-navy-700 mb-3">
              Adventures Remaining
            </p>
            <label className="block max-w-xs">
              <span className="text-sm text-navy-600">Adventures per year</span>
              <input
                type="number"
                min={0}
                max={52}
                value={adventuresPerYear}
                onChange={(e) => setAdventuresPerYear(Number(e.target.value))}
                className={inputClass}
              />
            </label>
            <StatResult
              label="Estimated adventures remaining"
              value={`~${fmt(activityStats.adventures)}`}
              sub={`At ${adventuresPerYear} per year`}
            />
          </div>

          {/* Summers & Holidays */}
          <div>
            <p className="text-sm font-semibold text-navy-700 mb-3">
              Seasons & Holidays
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatResult
                label="Summers remaining"
                value={`~${fmt(activityStats.summers)}`}
              />
              <StatResult
                label="Thanksgivings remaining"
                value={`~${fmt(activityStats.thanksgivings)}`}
              />
            </div>
          </div>

          {/* Work weeks */}
          <div>
            <p className="text-sm font-semibold text-navy-700 mb-3">Work</p>
            <label className="block max-w-xs">
              <span className="text-sm text-navy-600">Target retirement age</span>
              <input
                type="number"
                min={result.age}
                max={100}
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className={inputClass}
              />
            </label>
            <StatResult
              label="Work weeks remaining"
              value={`~${fmt(activityStats.workWeeks)}`}
              sub={`Until age ${retirementAge}`}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Grid */}
      <div className="mt-6 bg-white border border-sage-300 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-navy-700 mb-4">
          <span className="font-semibold">Life Phases</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-flame-500" /> 0–20
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-navy-700" /> 20–40
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-sage-500" /> 40–60
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-flame-700" /> 60–80
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-navy-900" /> 80+
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm ring-1 ring-navy-900 bg-white" /> You
          </span>
        </div>

        <div
          className="grid gap-[3px]"
          style={{ gridTemplateColumns: "repeat(52, minmax(0, 1fr))" }}
        >
          {Array.from({ length: result.totalWeeks }, (_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-[2px] ${getPhaseClass(
                i,
                result.livedWeeks,
                i === result.livedWeeks
              )}`}
              title={
                i === result.livedWeeks
                  ? "← You are here"
                  : `Week ${i + 1} of ${result.totalWeeks}`
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
