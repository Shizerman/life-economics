import Link from "next/link";
import { Resource, categoryColors } from "@/lib/resources";

export default function ResourceCard({ resource }: { resource: Resource }) {
  const tagClass = categoryColors[resource.category];

  const content = (
    <div className="bg-white border border-sage-300 rounded-lg p-6 flex flex-col h-full hover:shadow-md hover:border-flame-400 transition-all">
      <span className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${tagClass}`}>
        {resource.category}
      </span>
      <h3 className="font-heading text-lg font-bold text-navy-900 mt-3">
        {resource.title}
      </h3>
      <p className="text-navy-700 text-sm mt-2 flex-grow">
        {resource.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-flame-600 group-hover:text-flame-700">
        {resource.actionLabel}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  );

  if (resource.isDownload) {
    return (
      <a href={resource.href} download className="group">
        {content}
      </a>
    );
  }

  return (
    <Link href={resource.href} className="group">
      {content}
    </Link>
  );
}
