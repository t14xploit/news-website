import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteCategoryButton from "@/components/admin/categories/DeleteCategoryButton";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    take: 20,
  });

  return (
    <div className="p-6 max-w-lg">
      {/* Header */}
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link
          href="/admin/categories/new"
        >
          <Button variant={"outline"}>

          + Add Category
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="border rounded max-w-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-2 font-semibold">Category</th>
              <th className="p-2 font-semibold w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="border-t hover:bg-muted">
                  <td className="p-2">
                    <Link
                      href={`/admin/categories/${category.title}`}
                      className=" hover:underline"
                    >
                      {category.title}
                    </Link>
                  </td>
                  <td className="p-2 space-x-2">
                    <Link
                      href={`/admin/categories/${category.title}/edit`}
                      className="  hover:underline"
                    >
                      <Button  className="cursor-pointer" variant={"link"}>

                      <Edit/>
                      </Button>
                    </Link>
                    <DeleteCategoryButton name={category.title} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-4 text-center text-muted-foreground">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
