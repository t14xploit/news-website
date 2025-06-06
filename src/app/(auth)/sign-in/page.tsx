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
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("sign-in");
  const { sessionUser, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const imageSrc =
    activeTab === "sign-in" ? "/alien/alien_10.jpg" : "/alien/alien_11.jpg";

  useEffect(() => {
    if (!isLoading && sessionUser) {
      router.replace("/");
    }
  }, [sessionUser, isLoading, router]);

  useEffect(() => {
    if (pathname) {
      setActiveTab(pathname.includes("sign-up") ? "sign-up" : "sign-in");
    }
  }, [pathname]);

  const handleTabSwitch = (tabName: string) => {
    setActiveTab(tabName);
    router.push(tabName === "sign-in" ? "/sign-in" : "/sign-up");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start"></div>
        <div className="flex flex-1 items-center justify-center">
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
        </div>
      </div>

      <div className="hidden lg:block w-full h-full">
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            width={960}
            height={1080}
            alt="Authentication background"
            className="w-full h-full object-cover dark:brightness-[0.2] dark:grayscale"
            priority
          />
        </div>
      </div>
    </div>
  );
}
