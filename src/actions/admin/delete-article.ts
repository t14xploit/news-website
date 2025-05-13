"use server";
import {prisma} from "@/lib/prisma";
import { redirect } from "next/navigation";


export async function deleteArticle(articleId: string){
    await prisma.article.delete({
        where:{
            id:articleId
        }
    });
    redirect("/admin/articles");
}