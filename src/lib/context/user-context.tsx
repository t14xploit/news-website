// "use client";

// import {
//   createContext,
//   useContext,
//   ReactNode,
//   useState,
//   useEffect,
// } from "react";
// import { authClient } from "@/lib/auth-client";
// import { Skeleton } from "@/components/ui/skeleton";

// interface SubscriptionType {
//   name?: string | null;
// }

// interface Subscription {
//   type?: SubscriptionType | null;
// }

// interface ExtendedUser {
//   id: string;
//   email: string;
//   role?: string | null;
//   subscriptionId?: string | null;
//   name?: string | null;
//   avatar?: string | null;
//   subscription?: Subscription | null;
//   subscriptionType?: string | null;
// }

// interface UserContextType {
//   sessionUser: ExtendedUser | null;
//   user: ExtendedUser | null;
//   isLoading: boolean;
//   isAdmin: boolean;
//   isEditor: boolean;
//   hasSubscription: boolean;
//   subscriptionType: string | null | undefined;
//   refetchUser: () => Promise<void>;
//   renderLoading: () => React.ReactElement;
// }

// const UserContext = createContext<UserContextType>({
//   sessionUser: null,
//   user: null,
//   isLoading: true,
//   isAdmin: false,
//   isEditor: false,
//   hasSubscription: false,
//   subscriptionType: null,
//   refetchUser: async () => {},
//   renderLoading: () => <></>,
// });

// export function UserProvider({ children }: { children: ReactNode }) {
//   const [sessionUser, setSessionUser] = useState<ExtendedUser | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchUser = async () => {
//     try {
//       setIsLoading(true);
//       const response = await authClient.getSession();

//       if (response.data?.user) {
//         const sessionData = response.data;
//         setSessionUser({
//           ...sessionData.user,
//           subscriptionType: sessionData.subscriptionType || null,
//         } as ExtendedUser);
//       } else {
//         setSessionUser(null);
//       }
//     } catch (error) {
//       console.error("Failed to fetch user session:", error);
//       setSessionUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();

//     // Event listener for auth state changes
//     const handleStorageChange = (event: StorageEvent) => {
//       if (event.key === "auth-state-change") {
//         fetchUser();
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);

//   const isAdmin = sessionUser?.role === "admin";
//   const isEditor = sessionUser?.role === "editor" || isAdmin;
//   const hasSubscription = Boolean(sessionUser?.subscriptionId);
//   const subscriptionType = sessionUser?.subscription?.type?.name || null;

//   const renderLoading = () => (
//     <div className="w-full space-y-4">
//       <div className="flex items-center space-x-4">
//         <Skeleton className="h-12 w-12 rounded-full" />
//         <div className="space-y-2">
//           <Skeleton className="h-4 w-[150px]" />
//           <Skeleton className="h-4 w-[100px]" />
//         </div>
//       </div>
//       <Skeleton className="h-20 w-full" />
//       <div className="grid grid-cols-3 gap-4">
//         <Skeleton className="h-8 w-full" />
//         <Skeleton className="h-8 w-full" />
//         <Skeleton className="h-8 w-full" />
//       </div>
//     </div>
//   );

//   return (
//     <UserContext.Provider
//       value={{
//         sessionUser,
//         isLoading,
//         user: sessionUser,
//         isAdmin,
//         isEditor,
//         hasSubscription,
//         subscriptionType,
//         refetchUser: fetchUser,
//         renderLoading,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }

// export const useUser = () => useContext(UserContext);

"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscriptionType {
  name?: string | null;
}

interface Subscription {
  type?: SubscriptionType | null;
}

interface ExtendedUser {
  id: string;
  email: string;
  role?: string | null;
  subscriptionId?: string | null;
  name?: string | null;
  avatar?: string | null;
  subscription?: Subscription | null;
  subscriptionType?: string | null;
}

interface UserContextType {
  sessionUser: ExtendedUser | null;
  user: ExtendedUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  hasSubscription: boolean;
  subscriptionType: string | null | undefined;
  refetchUser: () => Promise<void>;
  renderLoading: () => React.ReactElement;
}

const UserContext = createContext<UserContextType>({
  sessionUser: null,
  user: null,
  isLoading: true,
  isAdmin: false,
  isEditor: false,
  hasSubscription: false,
  subscriptionType: null,
  refetchUser: async () => {},
  renderLoading: () => <></>,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [sessionUser, setSessionUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await authClient.getSession();
      console.log("UserProvider: Session Response", {
        user: response.data?.user
          ? {
              id: response.data.user.id,
              email: response.data.user.email,
              role: response.data.user.role,
            }
          : null,
        error: response.error,
      });

      if (response.data?.user) {
        const sessionData = response.data;
        setSessionUser({
          ...sessionData.user,
          subscriptionType: sessionData.subscriptionType || null,
        } as ExtendedUser);
      } else {
        setSessionUser(null);
      }
    } catch (error) {
      console.error("UserProvider: Failed to fetch user session:", error);
      setSessionUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "auth-state-change") {
        console.log("UserProvider: Auth state changed, refetching user");
        fetchUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isAdmin = sessionUser?.role === "admin";
  const isEditor = sessionUser?.role === "editor" || isAdmin;
  const hasSubscription = Boolean(sessionUser?.subscriptionId);
  const subscriptionType = sessionUser?.subscription?.type?.name || null;

  const renderLoading = () => (
    <div className="w-full space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );

  return (
    <UserContext.Provider
      value={{
        sessionUser,
        isLoading,
        user: sessionUser,
        isAdmin,
        isEditor,
        hasSubscription,
        subscriptionType,
        refetchUser: fetchUser,
        renderLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
