// components/MyChannel/CreateChannel.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function CreateChannel() {
  //   const { data: activeOrganization } = authClient.useActiveOrganization();
  //   const { data: session } = authClient.useSession();
  const { data: authData } = authClient.useSession();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const [channelName, setChannelName] = useState("");
  const [channelSlug, setChannelSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  //   const [isLoading] = useState();

  //   const user = session?.user;
  //   const role = user?.role;

  if (authData === undefined) {
    return <div>Loading…</div>;
  }

  if (authData === null) {
    return <div>Please sign in to create a channel.</div>;
  }

  if (authData.user.role !== "editor") {
    return <div>You are not authorized to create a channel.</div>;
  }

  //   const role = authData.user.role;
  //   if (role !== "editor") {
  //     return <div>You are not authorized to create a channel.</div>;
  //   }

  //     const { user, subscriptionType } = authData;
  //   const role = user.role;
  //   const planName = subscriptionType?.name;

  //       if (role !== "editor") {
  //     return <div>You are not authorized to create a channel.</div>;
  //   }
  //   if (planName !== "Business") {
  //     return (
  //       <div>
  //         You need a Business subscription to create a channel.
  //       </div>
  //     );
  //   }

  //   if (session.subscriptionType?.name !== "Business") {
  //     return (
  //       <div>
  //         You need a Business subscription to create a channel.
  //       </div>
  //     );
  //   }

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  //   if (role !== "editor") {
  //     return <div>You are not authorized to create a channel.</div>;
  //   }

  const handleCreateChannel = async () => {
    setIsCreating(true);
    try {
      if (!channelName || !channelSlug) {
        toast.error("Please enter a channel name and slug.");
        return;
      }

      //   if (user?.subscriptionType?.name !== "Business") {
      //     toast.error(
      //       "You must have a Business subscription to create a channel."
      //     );
      //     return;
      //   }

      await authClient.organization.create({
        name: channelName,
        slug: channelSlug,
      });
      toast.success("Channel created successfully!");
      // Optionally, refresh the page or fetch the user's organizations
    } catch (error) {
      console.error("Channel creation failed:", error);
      toast.error("Failed to create channel. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <h2>Create Your Channel</h2>
      <div>
        <div>
          {" "}
          {activeOrganization ? <p>{activeOrganization.name}</p> : null}
          <Input
            type="text"
            placeholder="Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Input
          type="text"
          placeholder="Channel Slug"
          value={channelSlug}
          onChange={(e) => setChannelSlug(e.target.value)}
        />
      </div>
      <Button onClick={handleCreateChannel} disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Channel"}
      </Button>

      {/* Optional: show which channel is currently active */}
      {activeOrganization && (
        <p className="text-sm text-gray-500">
          Current channel: {activeOrganization.name}
        </p>
      )}
    </div>
  );
}

// // components/MyChannel/CreateChannel.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { authClient } from "@/lib/auth-client";

// export default function CreateChannel() {
// //   const { data: session, isLoading } = useSession();
// const { data: session } =  authClient.useSession()

//   const [channelName, setChannelName] = useState("");
//   const [channelSlug, setChannelSlug] = useState("");
//   const [isCreating, setIsCreating] = useState(false);

//   if (session?.isLoading) { // Corrected: Check for isLoading from session
//     return <div>Loading...</div>;
//   }

//   const user = session?.user;
//   const role = user?.role;

//   if (role !== "editor") {
//     return <div>You are not authorized to create a channel.</div>;
//   }

//   const handleCreateChannel = async () => {
//     setIsCreating(true);
//     try {
//       if (!channelName || !channelSlug) {
//         toast.error("Please enter a channel name and slug.");
//         return;
//       }
//        if (user?.subscription?.type?.name !== "Business") { // Corrected comparison and used subscription.type
//             toast.error("You must have a Business subscription to create a channel.");
//             return;
//         }

//       await authClient.organization.create({
//         name: channelName,
//         slug: channelSlug,
//       });
//       toast.success("Channel created successfully!");
//       // Optionally, refresh the page or fetch the user's organizations
//     } catch (error) {
//       console.error("Channel creation failed:", error);
//       toast.error("Failed to create channel. Please try again.");
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Create Your Channel</h2>
//       <div>
//         <Input
//           type="text"
//           placeholder="Channel Name"
//           value={channelName}
//           onChange={(e) => setChannelName(e.target.value)}
//         />
//       </div>
//       <div>
//         <Input
//           type="text"
//           placeholder="Channel Slug"
//           value={channelSlug}
//           onChange={(e) => setChannelSlug(e.target.value)}
//         />
//       </div>
//       <Button onClick={handleCreateChannel} disabled={isCreating}>
//         {isCreating ? "Creating..." : "Create Channel"}
//       </Button>
//     </div>
//   );
// }
