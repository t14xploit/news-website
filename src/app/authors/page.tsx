import { prisma } from "@/lib/prisma";
import { searchAuthors } from "@/actions/searchAuthors"; 
import SearchForm from "./form"; 

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AuthorsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

  let authors;
  // Fetch authors based on the query
  if (query) {
    const formData = new FormData();
    formData.set("search", query);
    authors = await searchAuthors(formData);
  } else {
    // Fetch the first 20 authors if no query is present
    authors = await prisma.author.findMany({
      take: 20,
      include: { articles: { select: { id: true, headline: true } } },
    });
  }


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Authors</h1>
      <SearchForm initialAuthors={authors} /> 
    </div>
  );
}
