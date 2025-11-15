interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  onReset,
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="mb-8 flex justify-center">
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            className="border border-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#265b4e] w-96"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search advocates..."
          />
          <button
            onClick={onReset}
            className="bg-[#265b4e] hover:bg-[#1d4539] text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reset Search
          </button>
        </div>
      </div>
    </div>
  );
}
