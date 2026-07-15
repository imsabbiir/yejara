// Pagination.jsx (Client Component)
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    // Build the new search parameters structure smoothly
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    router.push(`?${params.toString()}`, { scroll: false });

    document.getElementById("shop")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const generatePages = () => {
    const pages = [];
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = generatePages();

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2 flex-wrap"
      aria-label="Pagination"
    >
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="grid size-10 place-items-center rounded-full bg-[#F8F1E1] transition hover:bg-[#F1E7CE] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className="size-10 rounded-full bg-[#F8F1E1] text-sm hover:bg-[#F1E7CE]"
          >
            1
          </button>
          {pages[0] > 2 && <span className="px-1 text-[#6A6154]">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`size-10 rounded-full text-sm transition ${
            currentPage === page
              ? "bg-[#F19268] text-[#2A1812] font-semibold shadow-md"
              : "bg-[#F8F1E1] hover:bg-[#F1E7CE]"
          }`}
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-[#6A6154]">...</span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            className="size-10 rounded-full bg-[#F8F1E1] text-sm hover:bg-[#F1E7CE]"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="grid size-10 place-items-center rounded-full bg-[#231D18] text-[#FCF7EB] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
