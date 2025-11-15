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
    <div style={{ marginBottom: "16px" }}>
      <label>
        Results per page:{" "}
        <select
          value={limit}
          onChange={handleChange}
          style={{ border: "1px solid black", padding: "4px" }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
      <span style={{ marginLeft: "16px" }}>
        Showing {startIndex} to {endIndex} of {total} results
      </span>
    </div>
  );
}
