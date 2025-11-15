import { NextRequest } from "next/server";
import { ilike, or, sql } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search")?.trim() || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Validate pagination parameters
  const validatedPage = Math.max(1, page);
  const validatedLimit = Math.min(Math.max(1, limit), 100); // Max 100 per page
  const offset = (validatedPage - 1) * validatedLimit;

  /********************** If using static data *******************************/
  let filteredData = advocateData;

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = advocateData.filter((advocate) => {
      const searchableText = [
        advocate.firstName,
        advocate.lastName,
        advocate.city,
        advocate.degree,
        ...(Array.isArray(advocate.specialties) ? advocate.specialties : []),
        advocate.yearsOfExperience.toString()
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchLower);
    });
  }

  // Calculate pagination
  const total = filteredData.length;
  const totalPages = Math.ceil(total / validatedLimit);

  // Apply pagination
  const paginatedData = filteredData.slice(offset, offset + validatedLimit);

  /************* If using database query instead of static data ************/
  /*
  let query = db.select().from(advocates);

  if (search) {
    const searchPattern = `%${search}%`;
    query = query.where(
      or(
        ilike(advocates.firstName, searchPattern),
        ilike(advocates.lastName, searchPattern),
        ilike(advocates.city, searchPattern),
        ilike(advocates.degree, searchPattern),
        sql`${advocates.specialties}::text ILIKE ${searchPattern}`,
        sql`${advocates.yearsOfExperience}::text ILIKE ${searchPattern}`
      )
    );
  }

  // Get total count for pagination
  const totalResult = await db.select({ count: sql<number>`count(*)` }).from(advocates);
  const total = totalResult[0].count;
  const totalPages = Math.ceil(total / validatedLimit);

  // Apply pagination
  const data = await query.limit(validatedLimit).offset(offset);
  */

  return Response.json({
    data: paginatedData,
    pagination: {
      page: validatedPage,
      limit: validatedLimit,
      total,
      totalPages,
      hasNextPage: validatedPage < totalPages,
      hasPreviousPage: validatedPage > 1
    }
  });
}
