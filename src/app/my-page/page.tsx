// "use client";

// import AccountSettingsForm from "@/components/my-page/account-settings-form";
// import SubscriptionsList from "@/components/my-page/subscriptions-list";
// import NewsletterSettingsForm from "@/components/my-page/newsletter-settings-form";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { usePlan } from "@/components/subscribe/plan-context";

// export default function MyPage() {
//   const { userId, isLoading } = usePlan();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Loading...
//       </div>
//     );
//   }

//   if (!userId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Please log in to access your page.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-20 flex flex-col items-center justify-start gap-4">
//       <h1 className="text-4xl font-medium">My Account</h1>
//       <h2 className="text-lg text-gray-400 mb-10">
//         Manage your information and settings
//       </h2>
//       <div className="w-full max-w-4xl space-y-6">
//         <Card className="w-full shadow-lg rounded-xl border hover:shadow-xl transition-shadow duration-300">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-2xl font-medium">
//               Account Settings
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-2">
//             <AccountSettingsForm />
//           </CardContent>
//         </Card>

//         <div className="grid gap-6 md:grid-cols-2">
//           <Card className=" shadow-md rounded-lg borderhover:shadow-lg transition-shadow duration-300">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-medium">
//                 Active Subscriptions
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-2">
//               <SubscriptionsList userId={userId} />
//             </CardContent>
//           </Card>
//           <Card className=" shadow-md rounded-lg border hover:shadow-lg transition-shadow duration-300">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg font-medium ">
//                 Newsletter Settings
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-2">
//               <NewsletterSettingsForm userId={userId} />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { redirect } from "next/navigation";

import AccountSettingsForm from "@/components/my-page/profile/account-settings-form";
import SubscriptionsList from "@/components/my-page/subscriptions-list";
import NewsletterSettingsForm from "@/components/my-page/newsletter-settings-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePlan } from "@/components/subscribe/plan-context";
import { useUser } from "@/lib/context/user-context";

export default function MyPage() {
  const { sessionUser, isLoading: userLoading } = useUser();
  const { userId, isLoading: planLoading } = usePlan();

  if (userLoading || planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (!sessionUser) {
    redirect("/sign-in");
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please log in to access your account.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center gap-8 pb-10 bg-background">
      <div className="text-center space-y-2 px-4">
        <h1 className="text-4xl font-semibold">My Account</h1>
        <h2 className="text-lg text-muted-foreground">
          Manage your information and settings
        </h2>
      </div>

      <div className="w-full max-w-4xl space-y-8 px-4">
        <Card className=" ">
          {/* <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-medium">
              Account Settings
            </CardTitle>
          </CardHeader> */}
          <CardContent className="">
            <AccountSettingsForm />
          </CardContent>
        </Card>

        <Card className=" ">
          <CardHeader className="">
            <CardTitle className="text-2xl font-medium">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <SubscriptionsList userId={userId} />
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader className="">
            <CardTitle className="text-2xl font-medium">
              Newsletter Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <NewsletterSettingsForm userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
