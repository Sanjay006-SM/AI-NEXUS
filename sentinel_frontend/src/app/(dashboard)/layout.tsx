import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen relative z-10 p-3 sm:p-6 gap-3 sm:gap-6">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full gap-4 sm:gap-6 overflow-hidden">
        <TopNav />
        <main className="flex-1 w-full max-w-[1600px] mx-auto overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
