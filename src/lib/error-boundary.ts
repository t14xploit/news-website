//

"use client";

import { useEffect, useState, ReactNode } from "react";
import React from "react";

export function ErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const body = document.querySelector("body");
    if (body && body.hasAttribute("cz-shortcut-listen")) {
      body.removeAttribute("cz-shortcut-listen");
    }

    const sidebarWrapper = document.querySelector(
      '[data-slot="sidebar-wrapper"]'
    );
    console.log("Client sidebar-wrapper HTML:", sidebarWrapper?.outerHTML);
    console.log(
      "SidebarInset count:",
      document.querySelectorAll('[data-slot="sidebar-inset"]').length
    );

    if (typeof window !== "undefined") {
      const checkMismatch = () => {
        if (sidebarWrapper?.getAttribute("data-slot") === null) {
          console.error(
            "Hydration mismatch detected: data-slot is null on client"
          );
          setHasError(true);
        }
      };
      checkMismatch();

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-slot" &&
            mutation.target === sidebarWrapper
          ) {
            checkMismatch();
          }
        }
      });

      if (sidebarWrapper) {
        observer.observe(sidebarWrapper, { attributes: true });
      }

      return () => observer.disconnect();
    }
  }, []);

  if (hasError)
    return React.createElement(
      "div",
      null,
      "Hydration Error: A mismatch was detected between server and client rendering of the sidebar. Please refresh the page or contact support."
    );
  return children;
}
