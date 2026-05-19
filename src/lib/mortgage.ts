export type Period = "monthly" | "yearly";

export interface MortgageInputs {
  purchasePrice: number;
  downPayment: number;
  annualRate: number;
  termYears: number;
  propertyTax: number;
  propertyTaxPeriod: Period;
  insurance: number;
  insurancePeriod: Period;
  includePmi: boolean;
  monthlyPmi: number;
  includeHoa: boolean;
  monthlyHoa: number;
}

export interface MonthRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface YearRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
  monthsInYear: number;
}

export interface MortgageResult {
  loanAmount: number;
  downPaymentPercent: number;
  monthlyPi: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyPmi: number;
  monthlyHoa: number;
  monthlyTotal: number;
  firstMonth: MonthRow;
  yearlySchedule: YearRow[];
  totalInterest: number;
  totalPrincipal: number;
  totalPiPayments: number;
  payoffYear: number;
}

function toMonthly(amount: number, period: Period) {
  return period === "yearly" ? amount / 12 : amount;
}

/** Fixed-rate monthly P&I: M = P * r(1+r)^n / ((1+r)^n - 1) */
function monthlyPayment(principal: number, annualRate: number, termYears: number) {
  const months = termYears * 12;
  if (months <= 0 || principal <= 0) return 0;

  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;

  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const loanAmount = Math.max(0, inputs.purchasePrice - inputs.downPayment);
  const downPaymentPercent =
    inputs.purchasePrice > 0 ? (inputs.downPayment / inputs.purchasePrice) * 100 : 0;

  const monthlyPi = monthlyPayment(loanAmount, inputs.annualRate, inputs.termYears);
  const monthlyTax = toMonthly(inputs.propertyTax, inputs.propertyTaxPeriod);
  const monthlyInsurance = toMonthly(inputs.insurance, inputs.insurancePeriod);
  const monthlyPmi = inputs.includePmi ? Math.max(0, inputs.monthlyPmi) : 0;
  const monthlyHoa = inputs.includeHoa ? Math.max(0, inputs.monthlyHoa) : 0;
  const monthlyEscrow = monthlyTax + monthlyInsurance + monthlyPmi + monthlyHoa;
  const monthlyTotal = monthlyPi + monthlyEscrow;

  const months = inputs.termYears * 12;
  const r = inputs.annualRate / 100 / 12;

  let balance = loanAmount;
  let firstMonth: MonthRow | null = null;
  const yearlySchedule: YearRow[] = [];

  let yearPrincipal = 0;
  let yearInterest = 0;
  let monthsInYear = 0;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;

  for (let m = 1; m <= months && balance > 1e-8; m++) {
    const interest = balance * r;
    let principal = monthlyPi - interest;
    if (principal > balance) principal = balance;

    const payment = principal + interest;
    balance = Math.max(0, balance - principal);

    yearPrincipal += principal;
    yearInterest += interest;
    monthsInYear += 1;
    totalPrincipalPaid += principal;
    totalInterestPaid += interest;

    if (m === 1) {
      firstMonth = {
        month: 1,
        payment,
        principal,
        interest,
        balance,
      };
    }

    if (m % 12 === 0 || m === months) {
      const year = Math.ceil(m / 12);
      cumulativePrincipal += yearPrincipal;
      cumulativeInterest += yearInterest;
      const escrowForPeriod = monthlyEscrow * monthsInYear;

      yearlySchedule.push({
        year,
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        totalPaid: Math.round(yearPrincipal + yearInterest + escrowForPeriod),
        remainingBalance: Math.round(balance),
        cumulativePrincipal: Math.round(cumulativePrincipal),
        cumulativeInterest: Math.round(cumulativeInterest),
        monthsInYear,
      });

      yearPrincipal = 0;
      yearInterest = 0;
      monthsInYear = 0;
    }
  }

  const defaultFirstMonth: MonthRow = {
    month: 1,
    payment: monthlyPi,
    principal: 0,
    interest: 0,
    balance: loanAmount,
  };

  const totalPrincipal = Math.round(totalPrincipalPaid);
  const totalInterest = Math.round(totalInterestPaid);

  return {
    loanAmount,
    downPaymentPercent,
    monthlyPi,
    monthlyTax,
    monthlyInsurance,
    monthlyPmi,
    monthlyHoa,
    monthlyTotal,
    firstMonth: firstMonth ?? defaultFirstMonth,
    yearlySchedule,
    totalInterest,
    totalPrincipal,
    totalPiPayments: totalPrincipal + totalInterest,
    payoffYear: inputs.termYears,
  };
}
