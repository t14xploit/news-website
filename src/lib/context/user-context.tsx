"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { authClient } from "@/lib/auth-client";

interface User {
  id: string;
  email: string;
  role: string | null | undefined;
  subscriptionId?: string | null | undefined;
  subscription?:
    | {
        type?:
          | {
              name?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  hasSubscription: boolean;
  subscriptionType: string | null | undefined;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  isEditor: false,
  hasSubscription: false,
  subscriptionType: null,
  refetchUser: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await authClient.getSession();

      if (response.data?.user) {
        setUser(response.data.user as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user session:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isAdmin = user?.role === "admin";
  const isEditor = user?.role === "editor" || isAdmin;
  const hasSubscription = Boolean(user?.subscriptionId);
  const subscriptionType = user?.subscription?.type?.name || null;

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        isEditor,
        hasSubscription,
        subscriptionType,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
