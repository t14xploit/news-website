import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Edit} from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteCategoryButton from "@/components/admin/categories/DeleteCategoryButton";

export default async function CategoriesPage() {
  // Fetch categories from the database
  const categories = await prisma.category.findMany({
    take: 20, 
  });

  return (
    <div className="w-xl  p-6">
      {/* Header section */}
      <div className="flex justify-between items-center pb-4 border-b">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new" className=" py-2 px-4 rounded-md text-sm">
            + Add Category
          </Link>
        </Button>
      </div>

      {/* Table section */}
      <div className="mt-6">
        {categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b">
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <Link href={`/admin/categories/${category.title}`} className=" font-medium">
                        {category.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <Link href={`/admin/categories/${category.title}/edit`}>
                          <Edit className="h-5 w-5" />
                        </Link>
                                <DeleteCategoryButton name={category.title} />
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No categories found.</div>
        )}
      </div>
    </div>
  );
}
