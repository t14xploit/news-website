// "use client";

// import { useUser } from "@/lib/context/user-context";
// import { authClient } from "@/lib/auth-client";
// import { Skeleton } from "@/components/ui/skeleton";
// import ArticleList from "@/components/my-channel/article-list-2";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function MyChannelPage() {
//   const router = useRouter();
//   const { user, isLoading } = useUser();
//   const { data: activeOrganization } = authClient.useActiveOrganization();

//   if (isLoading) {
//     return (
//       <div className="p-4 max-w-3xl mx-auto space-y-6">
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-6 w-full" />
//         <Skeleton className="h-12 w-full" />
//       </div>
//     );
//   }

//   if (!user) {
//     router.replace("/sign-in");
//     return null;
//   }

//   if (!activeOrganization) {
//     router.replace("/my-channel/create-channel");
//     return null;
//   }

//   return (
//     <div className="max-w-3xl mx-auto py-8 space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">{activeOrganization.name}</h1>
//         <Button asChild>
//           <Link href="/my-channel/articles/create">Create Article</Link>
//         </Button>
//       </div>
//       <ArticleList organizationId={activeOrganization.id} channelName={""} />
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { Skeleton } from "@/components/ui/skeleton";
// import ChannelArticleRow from "@/components/my-channel/channel-article-row";
// import { getArticlesForOrganization } from "@/actions/my-channel/get-articles";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// interface Article {
//   id: string;
//   headline: string;
//   summary: string;
//   imageUrl?: string | null;
//   authorName: string;
//   authorImageUrl?: string | null;
//   publishDate: Date;
//   views?: number;
//   commentCount?: number;
//   isPinned?: boolean;
// }

// export default function ArticleList({
//   organizationId,
// }: {
//   organizationId: string;
// }) {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       setIsLoading(true);
//       const list = await getArticlesForOrganization(organizationId);
//       setArticles(list);
//       setIsLoading(false);
//     }
//     load();
//   }, [organizationId]);

//   if (isLoading) {
//     // show 3 skeleton rows
//     return (
//       <div className="divide-y divide-border">
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="flex items-start justify-between space-x-4 py-6"
//           >
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-24" />
//               <Skeleton className="h-6 w-3/4" />
//               <div className="flex space-x-2">
//                 <Skeleton className="h-4 w-16" />
//                 <Skeleton className="h-4 w-10" />
//               </div>
//             </div>
//             <Skeleton className="h-24 w-40 rounded-sm" />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
// <div className="max-w-3xl mx-auto py-8 space-y-8">
//        <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">{activeOrganization.name}</h1>
//        <Button asChild>
//            <Link href="/my-channel/articles/create">Create Article</Link>
//         </Button>
//       </div>
//          {articles.map((article) => (
//         <ChannelArticleRow key={article.id} article={article} />
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/lib/context/user-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ChannelArticleRow from "@/components/my-channel/channel-article-row";
import { getArticlesForOrganization } from "@/actions/my-channel/get-articles";

interface Article {
  id: string;
  headline: string;
  summary: string;
  imageUrl?: string | null;
  authorName: string;
  authorImageUrl?: string | null;
  publishDate: Date;
  views?: number;
  commentCount?: number;
  isPinned?: boolean;
}

export default function ArticlesPage() {
  const { sessionUser, isLoading: userLoading, isEditor } = useUser();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debugging logs
  useEffect(() => {
    console.log("ArticlesPage State:", {
      sessionUser: sessionUser
        ? { id: sessionUser.id, role: sessionUser.role }
        : null,
      isEditor,
      userLoading,
      activeOrganization: activeOrganization
        ? { id: activeOrganization.id, name: activeOrganization.name }
        : null,
    });
  }, [sessionUser, isEditor, userLoading, activeOrganization]);

  // Fetch articles when organization is available
  useEffect(() => {
    async function loadArticles() {
      if (!activeOrganization?.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const list = await getArticlesForOrganization(activeOrganization.id);
        if (list.length === 0) {
          setError("No articles found for this channel.");
        } else {
          setArticles(list);
        }
      } catch (e) {
        setError("Failed to load articles.");
        console.error("ArticlesPage error:", e);
        toast.error("Failed to load articles.");
      } finally {
        setIsLoading(false);
      }
    }
    loadArticles();
  }, [activeOrganization?.id]);

  if (userLoading || isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-start justify-between space-x-4 py-6"
            >
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
              <Skeleton className="h-24 w-40 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!sessionUser) {
    console.warn("Redirecting: No session user");
    router.replace("/sign-in");
    return null;
  }

  if (!isEditor) {
    console.warn("Redirecting: User is not an editor", {
      role: sessionUser.role,
    });
    router.replace("/");
    return null;
  }

  if (!activeOrganization) {
    console.warn("Redirecting: No active organization");
    router.replace("/my-channel/create-channel");
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{activeOrganization.name}</h1>
        <Button asChild className="btn-white">
          <Link href="/my-channel/articles/create">Create Article</Link>
        </Button>
      </div>
      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : articles.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No articles yet. Create your first article!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="divide-y divide-border">
          {articles.map((article) => (
            <ChannelArticleRow key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
