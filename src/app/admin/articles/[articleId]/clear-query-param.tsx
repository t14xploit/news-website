"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ClearQueryParamOnLoad() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("created")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("created");
      router.replace(url.pathname); // Replaces without reloading
    }
  }, [router, searchParams]);

  return null;
}
