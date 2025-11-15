import { NextRequest } from "next/server";
import { ilike, or, sql } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search")?.trim() || "";

  // If using static data (for development)
  let data = advocateData;

  if (search) {
    const searchLower = search.toLowerCase();
    data = advocateData.filter((advocate) => {
      const searchableText = [
        advocate.firstName,
        advocate.lastName,
        advocate.city,
        advocate.degree,
        ...(Array.isArray(advocate.specialties) ? advocate.specialties : []),
        advocate.yearsOfExperience.toString(),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchLower);
    });
  }

  // Uncomment this section to use a database with optimized search
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

  const data = await query;
  */

  return Response.json({ data });
}
