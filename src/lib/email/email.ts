// import "server-only";
import nodemailer from "nodemailer";

let testAccount: nodemailer.TestAccount | null = null;

async function getTestAccount() {
  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
  }
  return testAccount;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const account = await getTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"OpenNews" <noreply@open-news.com>',
    to,
    subject,
    html,
  });

  console.log(`Email sent: ${info.messageId}`);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log(`Preview URL: ${previewUrl}`);

  return {
    messageId: info.messageId,
    previewUrl: previewUrl,
  };
}
