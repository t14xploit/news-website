"use server";
import {prisma} from "@/lib/prisma";
import { redirect } from "next/navigation";


export async function deleteCategory(name: string){
    await prisma.category.delete({
        where:{
            title:name
        }
    });
    redirect("/admin/categories");
}