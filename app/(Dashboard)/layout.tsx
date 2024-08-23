import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Dialog } from "@/components/ui/dialog";
import HelperContextProvider from "@/context/HelperContext";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <HelperContextProvider>
      <div>
        {" "}
        <main className="relative grid grid-cols-1 md:grid-cols-[300px,_1fr] h-screen w-full bg-[#FFFFFF] ">
          {/* sidebar */}
          <Sidebar />
          <div className="flex flex-col ">
            <Header />
            {children}
          </div>
        </main>
      </div>
    </HelperContextProvider>
  );
}
