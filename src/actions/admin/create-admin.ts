"use server";
import { revalidatePath } from "next/cache";

export async function createAdmin(
  email: string,
  password: string,
  name: string
) {
  try {
    const response = await fetch("/api/admin/create-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create admin user.");
    }

    revalidatePath("/admin/users");

    return { success: true, message: data.message };
  } catch (error: unknown) {
    console.error("Failed to create admin:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message: errorMessage };
  }
}
