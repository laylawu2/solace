"use client";

import { useEffect, useState } from "react";

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onClick = () => {
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

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={onChange}
          placeholder="Search advocates..."
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      {pagination && (
        <div style={{ marginBottom: "16px" }}>
          <label>
            Results per page:{" "}
            <select
              value={limit}
              onChange={handleLimitChange}
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
            Showing {advocates.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, pagination.total)} of {pagination.total}{" "}
            results
          </span>
        </div>
      )}
      <br />
      {isLoading && <p>Loading...</p>}
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, index) => (
                    <div key={index}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!isLoading && advocates.length === 0 && <p>No advocates found.</p>}
      <br />
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={handlePreviousPage}
            disabled={!pagination.hasPreviousPage}
            style={{
              padding: "8px 16px",
              border: "1px solid black",
              cursor: pagination.hasPreviousPage ? "pointer" : "not-allowed",
              opacity: pagination.hasPreviousPage ? 1 : 0.5
            }}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage}
            style={{
              padding: "8px 16px",
              border: "1px solid black",
              cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
              opacity: pagination.hasNextPage ? 1 : 0.5
            }}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
