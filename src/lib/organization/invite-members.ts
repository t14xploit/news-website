"use server";

import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const lastPreviewUrl: string | null = null;

const InviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["member", "admin"]),
  organizationId: z.string(),
});

export async function inviteMemberAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = InviteMemberSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Invalid invitation data" };
  }

  try {
    const previewUrlBefore = lastPreviewUrl;

    const apiResult = await authClient.organization.inviteMember({
      email: parsed.data.email.trim(),
      role: parsed.data.role,
      organizationId: parsed.data.organizationId,
    });

    if (apiResult.error) {
      return { success: false, error: apiResult.error.message };
    }

    const newPreviewUrl =
      lastPreviewUrl !== previewUrlBefore ? lastPreviewUrl : null;

    return {
      success: true,
      previewUrl: newPreviewUrl,
    };
  } catch (error) {
    console.error("Invitation error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send invitation",
    };
  }
}
