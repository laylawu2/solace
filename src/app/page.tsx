"use client";

import { useEffect, useMemo, useState } from "react";

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

interface AdvocateWithSearch extends Advocate {
  _searchableText: string;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<AdvocateWithSearch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term, wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch advocates");
        }
        return response.json();
      })
      .then((jsonResponse) => {
        // Pre-compute searchable text for each advocate
        const advocatesWithSearch: AdvocateWithSearch[] = jsonResponse.data.map(
          (advocate: Advocate) => ({
            ...advocate,
            _searchableText: [
              advocate.firstName,
              advocate.lastName,
              advocate.city,
              advocate.degree,
              ...advocate.specialties,
              advocate.yearsOfExperience.toString()
            ]
              .join(" ")
              .toLowerCase()
          })
        );
        setAdvocates(advocatesWithSearch);
      })
      .catch((error) => {
        console.error("Error fetching advocates:", error);
      });
  }, []);

  const filteredAdvocates = useMemo(() => {
    if (!debouncedSearchTerm) return advocates;

    console.log("filtering advocates...");
    const searchLower = debouncedSearchTerm.toLowerCase();

    return advocates.filter((advocate) =>
      advocate._searchableText.includes(searchLower)
    );
  }, [advocates, debouncedSearchTerm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onClick = () => {
    console.log(advocates);
    setSearchTerm("");
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
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
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
          {filteredAdvocates.map((advocate) => {
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
    </main>
  );
}
