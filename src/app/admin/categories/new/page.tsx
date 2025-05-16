import CreateCategoryForm from "./form";

export default async function page() {
 
  return (
    <div>
      <h1 className="py-4 text-xl">Create Category</h1>
      <CreateCategoryForm />
    </div>
  );
}
