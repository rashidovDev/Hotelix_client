import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  if (!items.length) {
    return null;
  }

  return (
    <nav
      aria-label="breadcrumb"
      className={`w-full rounded-2xl bg-gray-100 px-4 py-3 ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-medium text-gray-500">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href ?? "#"}
                  className="font-medium text-blue-600 transition hover:text-blue-800 hover:underline"
                >
                  {item.label}
                </Link>
              )}

              {!isLast ? (
                <span aria-hidden="true" className="select-none text-gray-400">
                  &gt;
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}