// import SignIn from "@/components/auth/sign-in";
// import { headers } from "next/headers";
// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";

// export default async function SignUpPage() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   console.log(session?.user);

// if (session) {
//   return (
//     <div className="w-full max-w-md mx-auto">
//       <h1 className="text-2xl font-bold">You are already signed in</h1>
//     </div>
//   );
//   redirect("/");
// }

//   return (
//     <div className="w-full max-w-md mx-auto my-12">
//       <SignIn />
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
import { useUser } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
// import Image from "next/image";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("sign-in");
  const { sessionUser, isLoading } = useUser();
  const router = useRouter();
  // const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && sessionUser) {
      // router.replace("/");
    }
  }, [sessionUser, isLoading, router]);

  const handleTabSwitch = (tabName: string) => {
    setActiveTab(tabName);
    // router.push(tabName === "sign-in" ? "/sign-in" : "/sign-up");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-md"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <SignIn onSwitchTab={() => handleTabSwitch("sign-up")} />
        </TabsContent>
        <TabsContent value="sign-up">
          <SignUp onSwitchTab={() => handleTabSwitch("sign-in")} />
        </TabsContent>
      </Tabs>
    </div>
      );
    }
      // <div className="relative hidden bg-muted lg:block">
     {/* <Image
          src="/placeholder.svg?height=800&width=600"
          alt="Authentication background"
          width={600}
          height={800}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      {/* </div> */}
    // </>
