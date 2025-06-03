import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    take: 20,
  });

  return (
    <div className="max-w-lg">
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
      <div className="border rounded max-w-xl">
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
                  <td className="p-3 space-x-3">
                    <Link href={`/admin/categories/${category.title}`}>
                      <Button variant="link" className="px-0 text-blue-600">
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/categories/${category.title}/edit`}>
                      <Button variant="link" className="px-0 text-muted-foreground">
                        Edit
                      </Button>
                    </Link>
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
