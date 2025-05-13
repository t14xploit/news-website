import { prisma } from "@/lib/prisma";
import { searchAuthors } from "@/actions/searchAuthors"; 
import SearchForm from "./form"; 
import { GiNewspaper } from "react-icons/gi";

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
      <h2 className="text-4xl font-bold my-6 flex items-center gap-2 py-3 border-b">
                        <GiNewspaper/> Authors
                        </h2>      <SearchForm initialAuthors={authors} /> 
    </div>
  );
}
