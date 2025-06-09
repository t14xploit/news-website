// // "use server";

// // import { prisma } from "@/lib/prisma";
// // import { auth } from "@/lib/auth";
// // import { z } from "zod";
// // import { revalidatePath } from "next/cache";
// // import { headers } from "next/headers";
// // import { checkOrganizationMembership } from "../my-channel/membership";

// // const createArticleSchema = z.object({
// //   headline: z.string().min(1, "Headline is required"),
// //   summary: z.string().min(1, "Summary is required"),
// //   content: z.string().min(1, "Content is required"),
// //   image: z.string().url().optional(),
// //   categoryIds: z.array(z.string()).optional(),
// // });

// // export async function createChannelArticle(
// //   organizationId: string,
// //   formData: FormData
// // ) {
// //   const headersList = await headers();
// //   const nativeHeaders = new Headers();

// //   for (const [key, value] of headersList.entries()) {
// //     nativeHeaders.set(key, value ?? "");
// //   }

// //   const session = await auth.api.getSession({ headers: nativeHeaders });

// //   // Authentication and authorization checks
// //   if (!session?.user) {
// //     return {
// //       success: false,
// //       error: "No active session found. Please log in.",
// //       status: 401,
// //     };
// //   }

// //   if (session.user.role !== "editor") {
// //     return {
// //       success: false,
// //       error: "Only editors can create articles",
// //       status: 403,
// //     };
// //   }

// //   // Check organization membership
// //   const membershipCheck = await checkOrganizationMembership(
// //     session.user.id,
// //     organizationId
// //   );

// //   if (!membershipCheck.isMember) {
// //     return {
// //       success: false,
// //       error: "You are not a member of this organization",
// //       status: 403,
// //     };
// //   }

// //   const data = Object.fromEntries(formData.entries());
// //   const parsed = createArticleSchema.safeParse({
// //     headline: data.headline,
// //     summary: data.summary,
// //     content: data.content,
// //     image: data.image || undefined,
// //     categoryIds: data.categories ? (data.categories as string).split(",") : [],
// //   });

// //   if (!parsed.success) {
// //     return {
// //       success: false,
// //       errors: parsed.error.flatten().fieldErrors,
// //       status: 400,
// //     };
// //   }

// //   try {
// //     const author = await prisma.author.upsert({
// //       where: { id: session.user.id },
// //       update: {},
// //       create: {
// //         id: session.user.id,
// //         name: session.user.name || session.user.email,
// //       },
// //     });

// //     // Verify and connect only existing categories
// //     const validCategories = await prisma.category.findMany({
// //       where: { id: { in: parsed.data.categoryIds || [] } },
// //     });

// //     // Create article with robust error handling
// //     const article = await prisma.article.create({
// //       data: {
// //         headline: parsed.data.headline,
// //         summary: parsed.data.summary,
// //         content: parsed.data.content,
// //         image: parsed.data.image,
// //         organizationId: organizationId,
// //         isEditorsChoice: false,
// //         categories: {
// //           connect: validCategories.map((cat) => ({ id: cat.id })),
// //         },
// //         authors: {
// //           connect: [{ id: author.id }],
// //         },
// //       },
// //     });

// //     revalidatePath("/my-channel/create");

// //     return {
// //       success: true,
// //       articleId: article.id,
// //       status: 201,
// //       redirectPath: `/my-channel/articles/${article.id}`,
// //     };
// //   } catch (error) {
// //     console.error("Detailed article creation error:", error);
// //     return {
// //       success: false,
// //       error: "Failed to create article. Please check your input and try again.",
// //       status: 500,
// //     };
// //   }
// // }

// "use server";

// import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { headers } from "next/headers";
// import { checkOrganizationMembership } from "../my-channel/membership";

// const createArticleSchema = z.object({
//   headline: z.string().min(1, "Headline is required"),
//   summary: z.string().min(1, "Summary is required"),
//   content: z.string().min(1, "Content is required"),
//   image: z.string().url().optional(),
//   categoryIds: z.array(z.string()).optional(),
// });

// async function getSession() {
//   const hdrs = await headers();
//   const native = new Headers();
//   for (const [k, v] of hdrs.entries()) {
//     native.set(k, v ?? "");
//   }
//   return auth.api.getSession({ headers: native });
// }

// export async function createChannelArticle(
//   organizationId: string,
//   formData: FormData
// ) {
//   const headersList = await headers();
//   const nativeHeaders = new Headers();

//   for (const [key, value] of headersList.entries()) {
//     nativeHeaders.set(key, value ?? "");
//   }

//   const session = await auth.api.getSession({ headers: nativeHeaders });

//   if (!session?.user) {
//     return {
//       success: false,
//       error: "No active session found. Please log in.",
//       status: 401,
//     };
//   }

//   if (session.user.role !== "editor") {
//     return {
//       success: false,
//       error: "Only editors can create articles",
//       status: 403,
//     };
//   }

//   const membershipCheck = await checkOrganizationMembership(
//     session.user.id,
//     organizationId
//   );

//   if (!membershipCheck.isMember) {
//     return {
//       success: false,
//       error: "You are not a member of this organization",
//       status: 403,
//     };
//   }

//   const data = Object.fromEntries(formData.entries());
//   const parsed = createArticleSchema.safeParse({
//     headline: data.headline,
//     summary: data.summary,
//     content: data.content,
//     image: data.image || undefined,
//     categoryIds: data.categories ? (data.categories as string).split(",") : [],
//   });

//   if (!parsed.success) {
//     return {
//       success: false,
//       errors: parsed.error.flatten().fieldErrors,
//       status: 400,
//     };
//   }

//   try {
//     const author = await prisma.author.upsert({
//       where: { id: session.user.id },
//       update: {},
//       create: {
//         id: session.user.id,
//         name: session.user.name || session.user.email,
//       },
//     });

//     const validCategories = await prisma.category.findMany({
//       where: { id: { in: parsed.data.categoryIds || [] } },
//     });

//     const article = await prisma.article.create({
//       data: {
//         headline: parsed.data.headline,
//         summary: parsed.data.summary,
//         content: parsed.data.content,
//         image: parsed.data.image,
//         organizationId,
//         isEditorsChoice: false,
//         categories: {
//           connect: validCategories.map((cat) => ({ id: cat.id })),
//         },
//         authors: {
//           connect: [{ id: author.id }],
//         },
//       },
//     });

//     revalidatePath("/my-channel/create");

//     return {
//       success: true,
//       articleId: article.id,
//       status: 201,
//       redirectPath: `/my-channel/articles/${article.id}`,
//     };
//   } catch (error) {
//     console.error("Detailed article creation error:", error);
//     return {
//       success: false,
//       error: "Failed to create article. Please check your input and try again.",
//       status: 500,
//     };
//   }
// }

// export async function getChannelArticle(
//   organizationId: string,
//   articleId: string
// ) {
//   return prisma.article.findFirst({
//     where: { id: articleId, organizationId },
//     include: {
//       authors: true,
//       categories: true,
//       organization: true,
//     },
//   });
// }

// export async function updateChannelArticle(
//   organizationId: string,
//   articleId: string,
//   formData: FormData
// ) {
//   const session = await getSession();
//   if (!session?.user) {
//     return { success: false, error: "Not authenticated", status: 401 };
//   }

//   const membership = await checkOrganizationMembership(
//     session.user.id,
//     organizationId,
//     ["owner", "admin"]
//   );
//   if (!membership.isMember) {
//     return { success: false, error: "Forbidden", status: 403 };
//   }

//   const data = Object.fromEntries(formData.entries());
//   const toUpdate = createArticleSchema
//     .pick({ headline: true, summary: true, content: true, image: true })
//     .safeParse({
//       headline: data.headline,
//       summary: data.summary,
//       content: data.content,
//       image: data.image || undefined,
//     });

//   if (!toUpdate.success) {
//     return {
//       success: false,
//       errors: toUpdate.error.flatten().fieldErrors,
//       status: 400,
//     };
//   }

//   await prisma.article.updateMany({
//     where: { id: articleId, organizationId },
//     data: toUpdate.data,
//   });

//   revalidatePath(`/my-channel/articles/${articleId}`);
//   return { success: true, status: 200 };
// }

// export async function deleteChannelArticle(
//   organizationId: string,
//   articleId: string
// ) {
//   const session = await getSession();
//   if (!session?.user) {
//     return { success: false, error: "Not authenticated", status: 401 };
//   }

//   const membership = await checkOrganizationMembership(
//     session.user.id,
//     organizationId,
//     ["owner", "admin"]
//   );
//   if (!membership.isMember) {
//     return { success: false, error: "Forbidden", status: 403 };
//   }

//   await prisma.article.deleteMany({
//     where: { id: articleId, organizationId },
//   });

//   revalidatePath("/my-channel");
//   return { success: true, status: 200 };
// }

"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { checkOrganizationMembership } from "../my-channel/membership";

interface Article {
  id: string;
  headline: string;
  summary: string;
  content: string;
  image: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  isEditorsChoice: boolean;
  authors: { id: string; name: string | null; picture: string | null }[];
  categories: { id: string; title: string }[];
  organizationId: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    createdAt: Date;
    updatedAt: Date;
    metadata: string | null;
  } | null;
  isGlobalRepost: boolean;
  originalArticleId: string | null;
}

const createArticleSchema = z.object({
  headline: z.string().min(1, "Headline is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().url().optional().or(z.literal("")),
  categories: z.array(z.string()).optional(),
});

const updateArticleSchema = createArticleSchema.partial();

async function getSessionWithHeaders() {
  const headersList = await headers();
  const nativeHeaders: Record<string, string> = {};
  for (const [key, value] of headersList.entries()) {
    nativeHeaders[key] = value ?? "";
  }
  return authClient.getSession({
    fetchOptions: { headers: nativeHeaders },
  });
}

export async function getChannelArticle(
  organizationId: string,
  articleId: string
): Promise<Article | null> {
  try {
    const session = await getSessionWithHeaders();
    if (!session.data?.user) {
      throw new Error("Unauthorized");
    }

    const article = await prisma.article.findFirst({
      where: { id: articleId, organizationId },
      include: {
        authors: true,
        categories: true,
        organization: true,
      },
    });

    if (!article) {
      return null;
    }

    return {
      ...article,
      authors: article.authors.map((author) => ({
        id: author.id,
        name: author.name,
        picture: author.picture,
      })),
      categories: article.categories.map((cat) => ({
        id: cat.id,
        title: cat.title,
      })),
      organization: article.organization,
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function createChannelArticle(
  organizationId: string,
  formData: FormData
) {
  const session = await getSessionWithHeaders();
  if (!session.data?.user) {
    return {
      success: false,
      error: "No active session found. Please log in.",
      status: 401,
    };
  }

  if (!["editor", "admin", "owner"].includes(session.data.user.role || "")) {
    return {
      success: false,
      error: "Only editors, admins, or owners can create articles.",
      status: 403,
    };
  }

  const membershipCheck = await checkOrganizationMembership(
    session.data.user.id,
    organizationId
  );
  if (!membershipCheck.isMember) {
    return {
      success: false,
      error: "You are not a member of this organization.",
      status: 403,
    };
  }

  const data = Object.fromEntries(formData.entries());
  const parsed = createArticleSchema.safeParse({
    headline: data.headline,
    summary: data.summary,
    content: data.content,
    image: data.image || "",
    categories: data.categories ? String(data.categories).split(",") : [],
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      status: 400,
    };
  }

  try {
    const author = await prisma.author.upsert({
      where: { id: session.data.user.id },
      update: {},
      create: {
        id: session.data.user.id,
        name:
          session.data.user.name || session.data.user.email || "Unknown Author",
      },
    });

    const validCategories = await prisma.category.findMany({
      where: { id: { in: parsed.data.categories || [] } },
    });

    const article = await prisma.article.create({
      data: {
        headline: parsed.data.headline,
        summary: parsed.data.summary,
        content: parsed.data.content,
        image: parsed.data.image || null,
        organizationId,
        isEditorsChoice: false,
        categories: {
          connect: validCategories.map((cat) => ({ id: cat.id })),
        },
        authors: {
          connect: { id: author.id },
        },
      },
    });

    revalidatePath("/my-channel");

    return {
      success: true,
      articleId: article.id,
      status: 201,
      redirectPath: `/my-channel/articles/${article.id}`,
    };
  } catch (error) {
    console.error("Error creating article:", error);
    return {
      success: false,
      error: "Failed to create article. Please check your input and try again.",
      status: 500,
    };
  }
}

export async function updateChannelArticle(
  organizationId: string,
  articleId: string,
  formData: FormData
) {
  const session = await getSessionWithHeaders();
  if (!session.data?.user) {
    return { success: false, error: "Not authenticated", status: 401 };
  }

  if (!["editor", "admin", "owner"].includes(session.data.user.role || "")) {
    return {
      success: false,
      error: "Only editors, admins, or owners can update articles.",
      status: 403,
    };
  }

  const membership = await checkOrganizationMembership(
    session.data.user.id,
    organizationId
  );
  if (!membership.isMember) {
    return {
      success: false,
      error: "You are not a member of this organization.",
      status: 403,
    };
  }

  const data = Object.fromEntries(formData.entries());
  const parsed = updateArticleSchema.safeParse({
    headline: data.headline,
    summary: data.summary,
    content: data.content,
    image: data.image || "",
    categories: data.categories ? String(data.categories).split(",") : [],
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      status: 400,
    };
  }

  try {
    const validCategories = await prisma.category.findMany({
      where: { id: { in: parsed.data.categories || [] } },
    });

    await prisma.article.update({
      where: { id: articleId, organizationId },
      data: {
        headline: parsed.data.headline,
        summary: parsed.data.summary,
        content: parsed.data.content,
        image: parsed.data.image || null,
        categories: {
          set: validCategories.map((cat) => ({ id: cat.id })),
        },
      },
    });

    revalidatePath(`/my-channel/articles/${articleId}`);
    return { success: true, status: 200 };
  } catch (error) {
    console.error("Error updating article:", error);
    return { success: false, error: "Failed to update article.", status: 500 };
  }
}

export async function deleteChannelArticle(
  organizationId: string,
  articleId: string
) {
  const session = await getSessionWithHeaders();
  if (!session.data?.user) {
    return { success: false, error: "Not authenticated", status: 401 };
  }

  // if (!["admin", "owner"].includes(session.data.user.role || "")) {
  //   return {
  //     success: false,
  //     error: "Only admins or owners can delete articles.",
  //     status: 403,
  //   };
  // }

  const membership = await checkOrganizationMembership(
    session.data.user.id,
    organizationId
  );
  if (!membership.isMember) {
    return {
      success: false,
      error: "You are not a member of this organization.",
      status: 403,
    };
  }

  try {
    await prisma.article.delete({
      where: { id: articleId, organizationId },
    });

    revalidatePath("/my-channel/articles");
    return { success: true, status: 200 };
  } catch (error) {
    console.error("Error deleting article:", error);
    return { success: false, error: "Failed to delete article.", status: 500 };
  }
}

export async function getCategories(): Promise<
  { id: string; title: string }[]
> {
  try {
    const categories = await prisma.category.findMany();
    return categories.map((cat) => ({ id: cat.id, title: cat.title }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
