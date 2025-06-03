import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface PageProps {
  searchParams: { page?: string };
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const currentPage = parseInt(searchParams.page ?? "1", 10);
  const pageSize = 10;

  const [categories, totalCount] = await Promise.all([
    prisma.category.findMany({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.category.count(),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link href="/admin/categories/new">
          <Button variant={"outline"}>+ Add Category</Button>
        </Link>
      </div>

      {/* Table */}
      <div className="border rounded">
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
                      className="hover:underline"
                    >
                      {category.title}
                    </Link>
                  </td>
                  <td className="p-3 space-x-3">

                    <Link href={`/admin/categories/${category.title}/edit`}>
                      <Button variant="link" className="px-0 text-blue-600">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/admin/categories/${category.title}`}>
                      <Button variant="link"  className="px-0 text-muted-foreground">
                        View
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${Math.max(currentPage - 1, 1)}`}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={`?page=${page}`}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href={`?page=${Math.min(currentPage + 1, totalPages)}`}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
