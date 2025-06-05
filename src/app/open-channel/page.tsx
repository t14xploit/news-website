"use client";

import { useUser } from "@/lib/context/user-context";
import Link from "next/link";

export default function OpenChannelTeaser() {
  const { sessionUser } = useUser();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Open Channel</h2>
      <p>View titles and excerpts of your articles.</p>
      {!sessionUser?.subscriptionId && (
        <p>
          <Link href="/subscription" className="text-blue-500 hover:underline">
            Upgrade to Elite
          </Link>{" "}
          to read full content.
        </p>
      )}
    </div>
  );
}

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import Link from "next/link";
// import { FileText, Plus, ArrowUpRight } from "lucide-react";

// export default function EditorChannelPage() {
//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">My Channel</h2>
//           <p className="text-muted-foreground">
//             Manage your content and collaborators
//           </p>
//         </div>
//         <Button asChild>
//           <Link href="/my-channel/articles/new">
//             <Plus className="mr-2 h-4 w-4" /> Create Article
//           </Link>
//         </Button>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Articles</CardTitle>
//             <CardDescription>
//               View and manage your recent content
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div className="flex items-center justify-between rounded-md border p-3">
//               <div className="flex items-center space-x-3">
//                 <FileText className="h-5 w-5 text-muted-foreground" />
//                 <div>
//                   <div className="font-medium">
//                     The Latest Technology Trends
//                   </div>
//                   <div className="text-xs text-muted-foreground">
//                     Published 2 days ago
//                   </div>
//                 </div>
//               </div>
//               <Button variant="ghost" size="sm" asChild>
//                 <Link href="/my-channel/articles/123">
//                   <ArrowUpRight className="h-4 w-4" />
//                 </Link>
//               </Button>
//             </div>

//             <div className="flex items-center justify-between rounded-md border p-3">
//               <div className="flex items-center space-x-3">
//                 <FileText className="h-5 w-5 text-muted-foreground" />
//                 <div>
//                   <div className="font-medium">
//                     Climate Change Impact Report
//                   </div>
//                   <div className="text-xs text-muted-foreground">
//                     Published 1 week ago
//                   </div>
//                 </div>
//               </div>
//               <Button variant="ghost" size="sm" asChild>
//                 <Link href="/my-channel/articles/456">
//                   <ArrowUpRight className="h-4 w-4" />
//                 </Link>
//               </Button>
//             </div>

//             <Button variant="outline" size="sm" className="w-full" asChild>
//               <Link href="/my-channel/articles">View All Articles</Link>
//             </Button>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Channel Analytics</CardTitle>
//             <CardDescription>Track your audience engagement</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Total Views</span>
//                 <span className="font-bold">15,342</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Avg. Read Time</span>
//                 <span className="font-bold">3:24</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Subscriber Growth</span>
//                 <span className="text-green-600 font-bold">+12%</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Team Members</CardTitle>
//             <CardDescription>Manage your collaborators</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                   JD
//                 </div>
//                 <div>
//                   <div className="font-medium">Jane Doe</div>
//                   <div className="text-xs text-muted-foreground">Editor</div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                   JS
//                 </div>
//                 <div>
//                   <div className="font-medium">John Smith</div>
//                   <div className="text-xs text-muted-foreground">
//                     Contributor
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Button variant="outline" size="sm" className="w-full" asChild>
//               <Link href="/my-channel/team">Manage Team</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// // app/my-channel/page.tsx
// import { ProtectedRoute } from "@/components/auth/protected-route";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";
// import { FileText, Plus, ArrowUpRight } from "lucide-react";
// import { useUser } from "@/lib/context/user-context";

// export default function EditorChannelPage() {
//   return (
//     <ProtectedRoute requiredRole="editor" requiresSubscription={true}>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-3xl font-bold tracking-tight">My Channel</h2>
//             <p className="text-muted-foreground">
//               Manage your content and collaborators
//             </p>
//           </div>
//           <Button asChild>
//             <Link href="/my-channel/articles/new">
//               <Plus className="mr-2 h-4 w-4" /> Create Article
//             </Link>
//           </Button>
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Articles</CardTitle>
//               <CardDescription>View and manage your recent content</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <div className="flex items-center justify-between rounded-md border p-3">
//                 <div className="flex items-center space-x-3">
//                   <FileText className="h-5 w-5 text-muted-foreground" />
//                   <div>
//                     <div className="font-medium">The Latest Technology Trends</div>
//                     <div className="text-xs text-muted-foreground">Published 2 days ago</div>
//                   </div>
//                 </div>
//                 <Button variant="ghost" size="sm" asChild>
//                   <Link href="/my-channel/articles/123">
//                     <ArrowUpRight className="h-4 w-4" />
//                   </Link>
//                 </Button>
//               </div>

//               <div className="flex items-center justify-between rounded-md border p-3">
//                 <div className="flex items-center space-x-3">
//                   <FileText className="h-5 w-5 text-muted-foreground" />
//                   <div>
//                     <div className="font-medium">Climate Change Impact Report</div>
//                     <div className="text-xs text-muted-foreground">Published 1 week ago</div>
//                   </div>
//                 </div>
//                 <Button variant="ghost" size="sm" asChild>
//                   <Link href="/my-channel/articles/456">
//                     <ArrowUpRight className="h-4 w-4" />
//                   </Link>
//                 </Button>
//               </div>

//               <Button variant="outline" size="sm" className="w-full" asChild>
//                 <Link href="/my-channel/articles">View All Articles</Link>
//               </Button>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Channel Analytics</CardTitle>
//               <CardDescription>Track your audience engagement</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Total Views</span>
//                   <span className="font-bold">15,342</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Avg. Read Time</span>
//                   <span className="font-bold">3:24</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Subscriber Growth</span>
//                   <span className="text-green-600 font-bold">+12%</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Team Members</CardTitle>
//               <CardDescription>Manage your collaborators</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                     JD
//                   </div>
//                   <div>
//                     <div className="font-medium">Jane Doe</div>
//                     <div className="text-xs text-muted-foreground">Editor</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                     JS
//                   </div>
//                   <div>
//                     <div className="font-medium">John Smith</div>
//                     <div className="text-xs text-muted-foreground">Contributor</div>
//                   </div>
//                 </div>
//               </div>

//               <Button variant="outline" size="sm" className="w-full" asChild>
//                 <Link href="/my-channel/team">Manage Team</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }
