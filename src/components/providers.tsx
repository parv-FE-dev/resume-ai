"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgb(24 24 27)",
            border: "1px solid rgba(255 255 255 / 0.1)",
            color: "rgb(244 244 245)",
          },
        }}
      />
    </>
  );
}
