import { notFound } from "next/navigation";
import EditCategoryForm from "./form";
import { prisma } from "@/lib/prisma";


type Params = Promise<{ 

    title: string; 

}>;
type Props = { 

    params: Params; 

} 
export default async function EditCategoryPage(props:Props) {
    const params = await props.params; 
const title = params.title;

const category = await prisma.category.findUnique({ 

    where: { 

      title:title, 

    }, 

  }); 

 

  if (!category) { 

    notFound(); 

  } 

  return (
    <div>
      <h1>Edit Category</h1>
      <EditCategoryForm category={category} />
    </div>
  );
}
