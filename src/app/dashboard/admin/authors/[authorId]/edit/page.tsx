import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditAuthorForm from "./form";  // Your form component

type Params = Promise<{
  authorId: string;
}>;

type Props = {
  params: Params;
};

export default async function EditArticePage(props: Props) {
  const params = await props.params;
  const authorId = params.authorId;

  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: { articles: true }, // Fetch articles associated with the author
  });

  if (!author) {
    notFound();
  }

  // Pass the articles (not just the IDs) to the form
  return (
    <div className="mt-4 text-center">
      <h1 className="text-3xl font-bold">Edit Author</h1>
      <EditAuthorForm
        authorId={authorId}
        name={author.name}
        image={author.picture}
        articles={author.articles.map((article) => ({ id: article.id, headline: article.headline }))} // Pass the full articles data
      />
    </div>
  );
}
