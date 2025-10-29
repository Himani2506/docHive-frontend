import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Blob from "@/components/blob";

export default function RootLayout({ children }) {
  return (
    <main className="flex gap-2 w-full min-h-screen overflow-hidden relative">
      <SidebarProvider
        style={{
          "--sidebar-width": "19rem",
        }}
      >
        <AppSidebar />

        {/* Make the content area scrollable */}
        <div className="flex-1 overflow-y-auto h-screen">
          {children}
        </div>

        {/* Blobs stay positioned */}
        <div className="w-full h-full absolute -top-10 -left-5 flex flex-col -space-y-48 bg-gray-100/20">
          <div className="flex items-center justify-between -z-50">
            <Blob className="bg-green-200/60" />
            <Blob className="bg-pink-200/60" />
          </div>
          <div className="flex items-center justify-end -z-50">
            <Blob className="bg-blue-200/60 ml-20" />
          </div>
          <div className="flex items-center justify-start -z-50">
            <Blob className="bg-pink-200/60" />
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
