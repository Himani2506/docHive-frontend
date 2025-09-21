import React from "react";

export default function RootLayout({ children }) {
  return (
    <main className="h-screen overflow-auto">
        {children}
    </main>
  );
}
