interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        style={{
          padding: "8px 16px",
          border: "1px solid black",
          cursor: hasPreviousPage ? "pointer" : "not-allowed",
          opacity: hasPreviousPage ? 1 : 0.5,
        }}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        style={{
          padding: "8px 16px",
          border: "1px solid black",
          cursor: hasNextPage ? "pointer" : "not-allowed",
          opacity: hasNextPage ? 1 : 0.5,
        }}
      >
        Next
      </button>
    </div>
  );
}
