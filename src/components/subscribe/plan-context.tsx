"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getActiveSubscription } from "@/actions/subscribe-action";
import { useUser } from "@/lib/context/user-context";

export type PlanType = "Free" | "Elite" | "Business" | "";

export interface UserData {
  name: string;
  email: string;
  avatar: string;
}

interface PlanContextType {
  currentPlan: PlanType;
  setCurrentPlan: React.Dispatch<React.SetStateAction<PlanType>>;
  userId: string;
  isLoading: boolean;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

interface PlanProviderProps {
  children: React.ReactNode;
  initialUserData: UserData;
}

const PlanContext = createContext<PlanContextType>({
  currentPlan: "",
  setCurrentPlan: () => {},
  userId: "",
  isLoading: true,
  userData: { name: "", email: "", avatar: "" },
  setUserData: () => {},
});

export function PlanProvider({ children, initialUserData }: PlanProviderProps) {
  //Sophie
  // const getInitialPlan = (): PlanType => {
  //   if (typeof window === "undefined") {
  //     console.log(
  //       "SSR: Initializing currentPlan as '' (12:17 PM CEST, May 15, 2025)"
  //     );
  //     return "";
  //   }
  //   console.log("Client: Initializing currentPlan as ''");
  //   return "";
  // };

  // const [currentPlan, setCurrentPlan] = useState<PlanType>(getInitialPlan());
  const [currentPlan, setCurrentPlan] = useState<PlanType>("");
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const { sessionUser } = useUser();

  useEffect(() => {
    async function syncPlan() {
      //Sophie
      try {
        const sessionUserId = sessionUser?.id;

        if (!sessionUserId) {
          console.warn("No authenticated user found.");
          setIsLoading(false);
          return;
        }
        console.log("Authenticated user found:", sessionUserId);
        console.log("Authenticated user ID:", sessionUserId);

        setUserId(sessionUserId);
        const { plan: backendPlan, subscriptionId } =
          await getActiveSubscription(sessionUserId);
        console.log(
          "Backend plan received:",
          backendPlan,
          "with subscription ID:",
          subscriptionId
        );
        // Sophie

        // let storedUserId = localStorage.getItem("userId");
        // if (!storedUserId) {
        //   storedUserId = `user_${Date.now()}`;
        //   localStorage.setItem("userId", storedUserId);
        //   console.log("Generated new userId:", storedUserId);
        //   localStorage.setItem("currentPlan", "");
        // }
        // setUserId(storedUserId);

        // console.log("Fetching backend plan for user", storedUserId);
        // const { plan: backendPlan, subscriptionId } = await getActiveSubscription(
        //   storedUserId
        // );
        // console.log(
        //   "Backend plan received:",
        //   backendPlan,
        //   "with subscription ID:",
        //   subscriptionId
        // );

        const storedSubscriptionId = sessionStorage.getItem("subscriptionId");
        console.log(
          "Stored subscription ID in sessionStorage:",
          storedSubscriptionId
        );

        const isValidSubscription =
          subscriptionId && storedSubscriptionId === subscriptionId;

        const validBackendPlan =
          isValidSubscription &&
          // backendPlan && // Sophie
          ["Free", "Elite", "Business"].includes(backendPlan)
            ? (backendPlan as PlanType)
            : "";

        if (validBackendPlan) {
          console.log("Setting currentPlan from backend:", validBackendPlan);
          setCurrentPlan(validBackendPlan);
          localStorage.setItem("currentPlan", validBackendPlan);
        } else {
          console.log(
            "No valid backend plan or session mismatch, setting to ''"
          );
          setCurrentPlan("");
          localStorage.setItem("currentPlan", "");
          sessionStorage.removeItem("subscriptionId");
        }
      } catch (error) {
        console.error("Sync plan failed:", error);
        setCurrentPlan("");
      } finally {
        setIsLoading(false);
      }
    }

    syncPlan();
  }, [sessionUser]);

  //Sophie
  //     setIsLoading(false);
  //   }
  //   syncPlan().catch((error) =>
  //     console.error(
  //       "Sync plan failed:",
  //       error,
  //       "at 12:17 PM CEST, May 15, 2025"
  //     )
  //   );
  // }, []);

  return (
    <PlanContext.Provider
      value={{
        currentPlan,
        setCurrentPlan,
        userId,
        isLoading,
        userData,
        setUserData,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
};
