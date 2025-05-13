import { auth } from "@/lib/auth";
import CreateArticleForm from "./form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreateMoviePage() {
  const session =  await auth.api.getSession({
    headers: await headers(),
  });

  if(!session){
    redirect("/sign-in");
  }
  return (
    <div>
        <div>
           <h1 className="font-semibold text-2xl text-center"> Create Article </h1>
           </div>
        <CreateArticleForm />
    </div>
  )
}
