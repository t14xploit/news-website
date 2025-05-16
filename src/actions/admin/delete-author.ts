"use server";
import {prisma} from "@/lib/prisma";
import { redirect } from "next/navigation";


export async function deleteAuthor(authorId: string){
    await prisma.author.delete({
        where:{
            id:authorId
        }
    });
    redirect("/admin/authors");
}