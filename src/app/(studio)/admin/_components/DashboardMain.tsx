"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

type IProps = {
  headerLogo: string | null;
  user: any;
  children: React.ReactNode;
};
export default function DashboardMain({ children, user, headerLogo }: IProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // toggle sidebar is used to open and close the sidebar on Mobile View
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} headerLogo={headerLogo} />
      <div
        className={`
          flex flex-col h-screen grow-1
          `}
          >
        {/* ${sidebarOpen ? "ml-0" : "lg:ml-[290px]"} */}
        <DashboardHeader toggleSidebar={toggleSidebar} user={user} headerLogo={headerLogo} />
        <main className={`
          w-full block
          p-6
          overflow-y-auto 
          bg-gray-2 
        `}>{children}</main>
      </div>

      {/* Overlays */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 transition-opacity bg-gray-7/80 backdrop-blur-lg"
          aria-hidden="true"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
