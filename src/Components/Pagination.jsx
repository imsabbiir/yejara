import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md border text-sm flex items-center gap-1 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-red-400 hover:text-white border-red-400 cursor-pointer"
        }`}
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md border text-sm cursor-pointer ${
            page === currentPage
              ? "bg-red-400 text-white border-red-400"
              : "hover:bg-red-100 border-red-300"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md border text-sm flex items-center gap-1 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-red-400 hover:text-white border-red-400 cursor-pointer"
        }`}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
