"use client";

import { useEffect, useState } from "react";
import PaginationControls from "@/components/PaginationControls";
import LimitSelector from "@/components/LimitSelector";
import SearchBar from "@/components/SearchBar";

interface Advocate {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [expandedSpecialties, setExpandedSpecialties] = useState<Set<number>>(
    new Set()
  );

  // Debounce search term, wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch advocates with server-side search and pagination
  useEffect(() => {
    const fetchAdvocates = async () => {
      setIsLoading(true);
      setExpandedSpecialties(new Set()); // Reset expanded rows on page change

      try {
        const url = new URL("/api/advocates", window.location.origin);

        if (debouncedSearchTerm) {
          url.searchParams.set("search", debouncedSearchTerm);
        }

        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", limit.toString());

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Failed to fetch advocates");
        }

        const jsonResponse = await response.json();

        setAdvocates(jsonResponse.data);
        setPagination(jsonResponse.pagination);
      } catch (error) {
        console.error("Error fetching advocates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, [debouncedSearchTerm, page, limit]);

  const handleResetSearch = () => {
    setSearchTerm("");
  };

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const toggleSpecialties = (rowIndex: number) => {
    setExpandedSpecialties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }

      return newSet;
    });
  };

  return (
    <main className="p-12 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Solace Advocates</h1>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onReset={handleResetSearch}
      />

      {pagination && (
        <LimitSelector
          limit={limit}
          total={pagination.total}
          currentPage={page}
          currentCount={advocates.length}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      )}

      {isLoading && <p className="my-4">Loading...</p>}

      <table className="w-full border-collapse bg-white mb-4">
        <thead className="bg-white border-b-2 border-gray-200">
          <tr className="text-left [&>th]:px-4 [&>th]:py-6">
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th className="max-w-md">Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate, index) => {
            return (
              <tr
                key={advocate.id}
                className={`transition-colors [&>td]:px-4 [&>td]:py-3 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-[#265b4e]/5`}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d59618] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {advocate.firstName[0]}
                      {advocate.lastName[0]}
                    </div>
                    <span className="font-medium">{advocate.firstName}</span>
                  </div>
                </td>
                <td className="font-medium">{advocate.lastName}</td>
                <td>
                  <span className="text-gray-700">{advocate.city}</span>
                </td>
                <td>
                  <span className="text-gray-700">{advocate.degree}</span>
                </td>
                <td className="max-w-md">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {(expandedSpecialties.has(index)
                      ? advocate.specialties
                      : advocate.specialties.slice(0, 2)
                    ).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border border-[#265b4e] text-[#265b4e]"
                      >
                        {specialty}
                      </span>
                    ))}
                    {advocate.specialties.length > 2 && (
                      <button
                        onClick={() => toggleSpecialties(index)}
                        className="text-xs text-[#265b4e] hover:text-[#1d4539] font-medium underline whitespace-nowrap"
                      >
                        {expandedSpecialties.has(index)
                          ? "show less"
                          : `+${advocate.specialties.length - 2} more`}
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {advocate.yearsOfExperience}
                    </span>
                    <span className="text-sm text-gray-500">years</span>
                    {advocate.yearsOfExperience >= 10 && (
                      <span className="text-[#d59618]" title="Senior Advocate">
                        ⭐
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-gray-600">{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!isLoading && advocates.length === 0 && (
        <p className="my-4">No advocates found.</p>
      )}

      {pagination && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
      )}
    </main>
  );
}
