import { getProjects } from "@/lib/github";

/**
 * GET /api/github/repos
 *
 * Returns the normalized, filtered list of portfolio projects built from the
 * public GitHub REST API. Data comes from the server-side cache in
 * `getProjects()` (revalidated every 60 minutes), so calling this endpoint
 * does not hit GitHub on every request.
 *
 * Query params:
 *   ?featured=true  → only featured projects (ordered by priority)
 */
export async function GET(request: Request) {
  const payload = await getProjects();
  const featuredOnly = new URL(request.url).searchParams.get("featured") === "true";

  const projects = featuredOnly
    ? payload.projects
        .filter((p) => p.featured)
        .sort((a, b) => (a.featuredPriority ?? 99) - (b.featuredPriority ?? 99))
    : payload.projects;

  return Response.json(
    { ...payload, projects, count: projects.length },
    {
      status: payload.status === "error" ? 503 : 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
