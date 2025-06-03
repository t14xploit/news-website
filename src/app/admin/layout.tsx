import { AppSidebar } from "@/components/sidebar-nav/app-sidebar";
import { Toaster } from "@/components/ui/sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" min-h-screen">
      <div className="flex-shrink-0">
        <AppSidebar
          user={{
            name: "",
            email: "",
            avatar: "",
          }}
        />
      </div>
      <main className="flex flex-1 flex-col min-h-[calc(100vh-var(--header-height))] w-full">
        <div className="flex flex-1 flex-col max-w-full md:max-w-full mx-auto px-4 lg:px-8 w-full">
          <div className="flex flex-1 flex-col gap-4 py-4 sm:gap-6 sm:py-6">
            {children}
          </div>
          <Toaster />

        </div>
      </main>
    </div>
  );
}
