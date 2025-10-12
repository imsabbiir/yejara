// components/MyPagination.jsx
"use client";
import * as React from "react";
import Pagination from "@mui/material/Pagination";
import { useMediaQuery } from "@mui/material";

export default function MyPagination({ page, totalPages, onChange }) {
  // Detect mobile (screen < 640px)
  const isMobile = useMediaQuery("(max-width:640px)");

  return (
    <Pagination
      count={totalPages}
      page={page}
      onChange={(_, value) => onChange(value)}
      variant="outlined"
      shape="rounded"
      color="error"
      size={isMobile ? "small" : "medium"} // smaller on mobile
      sx={{
        "& .MuiPaginationItem-root": {
          minWidth: isMobile ? 32 : 48,
          height: isMobile ? 32 : 48,
          fontSize: isMobile ? "0.8rem" : "1.1rem",
        },
      }}
    />
  );
}
