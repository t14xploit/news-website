import { notFound } from "next/navigation";
import {prisma} from "@/lib/prisma";
import EditArticleForm from "./form";
type Params = Promise<{
    articleId: string;
}>;

type Props = {
    params: Params;
}

export default async function EditArticePage(props:Props) {
    const params = await props.params;
    const articleId = params.articleId;

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        categories: true, 
        authors:true,
      },
    })
  
    if (!article) {
      notFound();
    }


    return (
    <div className=" mt-4 text-center">
        <h1 className="text-3xl font-bold">
Edit Article           </h1>
<EditArticleForm article={article}/>

            </div>
  )
}
