export type ResourceCategory = "Calculator" | "Spreadsheet" | "Guide";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  href: string;
  actionLabel: string;
  isDownload?: boolean;
}

export const resources: Resource[] = [
  {
    id: "compound-interest",
    title: "Compound Interest Calculator",
    description:
      "See how your money grows over time with the power of compound interest. Adjust contributions, rates, and time horizon.",
    category: "Calculator",
    href: "/tools/compound-interest",
    actionLabel: "Open Tool",
  },
  {
    id: "quick-budget",
    title: "Quick Budget Spreadsheet",
    description:
      "A simple, no-nonsense spreadsheet to map out your monthly income and expenses. Download and make it your own.",
    category: "Spreadsheet",
    href: "/downloads/quick-budget.xlsx",
    actionLabel: "Download",
    isDownload: true,
  },
  {
    id: "what-are-your-whys",
    title: "What Are Your Whys",
    description:
      "A reflective worksheet to clarify your core motivations and connect your financial goals to what matters most.",
    category: "Guide",
    href: "/downloads/what-are-your-whys.pdf",
    actionLabel: "Download PDF",
    isDownload: true,
  },
];

export const categoryColors: Record<ResourceCategory, string> = {
  Calculator: "bg-flame-100 text-flame-800",
  Spreadsheet: "bg-navy-100 text-navy-800",
  Guide: "bg-sage-200 text-navy-800",
};
