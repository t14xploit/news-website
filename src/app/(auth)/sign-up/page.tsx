import SignUp from "@/components/auth/sign-up";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session?.user);

  // if (session) {
  //   return (
  //     <div className="w-full max-w-md mx-auto">
  //       <h1 className="text-2xl font-bold">You are already signed in</h1>
  //     </div>
  //   );
  //   redirect("/");
  // }

  return (
    <div className="w-full max-w-md mx-auto my-12">
      <SignUp />
    </div>
  );
}
