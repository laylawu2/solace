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
    <div className="flex gap-2 items-center">
      <button
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        className={`px-4 py-2 border border-black rounded transition-colors ${
          hasPreviousPage
            ? "hover:bg-gray-100 cursor-pointer"
            : "cursor-not-allowed opacity-50"
        }`}
      >
        Previous
      </button>
      <span className="mx-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        className={`px-4 py-2 border border-black rounded transition-colors ${
          hasNextPage
            ? "hover:bg-gray-100 cursor-pointer"
            : "cursor-not-allowed opacity-50"
        }`}
      >
        Next
      </button>
    </div>
  );
}
