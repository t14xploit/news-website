"use client";

import { setCookieConsent } from "@/actions/cookieConsent"; // Import the action function
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

const CookieConsent = () => {
  const handleAccept = async () => {
    // Set the cookie consent to "accepted" using the action function
    await setCookieConsent("accepted");
    // Hide the consent dialog after accepting cookies
    const consentDialog = document.getElementById('cookie-consent');
    if (consentDialog) {
      consentDialog.style.display = 'none'; // Hide the dialog
    }
  };

  const handleDecline = () => {
    // Show an alert telling the user they cannot use the site without accepting cookies
    alert("You cannot use the website without accepting cookies. Please accept the cookies to continue.");
    // Keep the consent dialog open because they need to click 'Accept' to proceed
    // No changes to consent dialog visibility here
  };

  return (
    <Card
      id="cookie-consent"
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2   rounded-lg shadow-xl z-50 max-w-xs w-full space-y-4 bg-background"
    >
      <CardContent className="text-sm text-muted-foreground">
        <p>
            This website uses cookies to improve your experience. By continuing to use this site, you consent to the use of cookies.
            </p>
      </CardContent>
        
      <CardFooter className="flex justify-between">
        <Button
variant={"outline"}          onClick={handleDecline}
>
          Decline
        </Button>
        <Button
variant={"default"}
onClick={handleAccept}
>
          Accept
        </Button>
            </CardFooter>
    </Card>
  );
};

export default CookieConsent;
