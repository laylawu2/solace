interface LimitSelectorProps {
  limit: number;
  total: number;
  currentPage: number;
  currentCount: number;
  onLimitChange: (limit: number) => void;
}

export default function LimitSelector({
  limit,
  total,
  currentPage,
  currentCount,
  onLimitChange,
}: LimitSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLimitChange(parseInt(e.target.value));
  };

  const startIndex = currentCount > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endIndex = Math.min(currentPage * limit, total);

  return (
    <div className="mb-4 flex items-center gap-4">
      <label className="flex items-center gap-2">
        <span className="text-sm font-medium">Results per page:</span>
        <select
          value={limit}
          onChange={handleChange}
          className="border border-black px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#265b4e]"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
      <span className="text-sm text-gray-600">
        Showing {startIndex} to {endIndex} of {total} results
      </span>
    </div>
  );
}
