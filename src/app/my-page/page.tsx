import PasswordResetForm from "@/components/my-page/password-reset-form";
import SubscriptionsList from "@/components/my-page/subscriptions-list";
import NewsletterSettingsForm from "@/components/my-page/newsletter-settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockUserId = "mock-user-id";

export default async function MyPage() {
  //   const session = await customSession();
  //   if (!session) {
  //     return <div>Please log in to access your page.</div>;
  //   }

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-start gap-4">
      <h1 className="text-4xl font-medium">My Account</h1>
      <h2 className="text-gray-400 mb-10">
        Mange your information and settings
      </h2>
      <div className="w-full max-w-4xl grid gap-6 md:grid-cols-2 ">
        <Card>
          <CardHeader>
            <CardTitle>Password Reset</CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordResetForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionsList userId={mockUserId} />
            {/* userId={session.userId} */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Newsletter Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <NewsletterSettingsForm userId={mockUserId} />
            {/* userId={session.userId}  */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
