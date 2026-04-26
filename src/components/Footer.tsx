import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/resources" className="hover:text-white transition-colors">
            Resources
          </Link>
          <a
            href="https://lifeeconomics.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Newsletter
          </a>
        </div>
        <p className="text-navy-400">
          &copy; {new Date().getFullYear()} Life Economics
        </p>
      </div>
    </footer>
  );
}
