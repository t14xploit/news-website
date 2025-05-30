import CreateAuthorForm from "./form";

export default async function page() {
 
  return (
    <div>
      <h1 className="text-2xl font-bold border-b">Create Author</h1>
      <CreateAuthorForm />
    </div>
  );
}
