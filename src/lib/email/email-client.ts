type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

type SendEmailResponse = {
  messageId: string;
  previewUrl: string | false;
};

export async function sendEmailFromClient(
  params: SendEmailParams
): Promise<SendEmailResponse> {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send email");
  }

  return response.json();
}
