import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import { ModeToggle } from "@/components/theme/mode-toggle";

export function SiteHeader() {
  return (
    <div>
      <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)] py-9 px-4 lg:gap-4 lg:px-6">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="scale-120 -ml-1" />
          <Separator
            orientation="vertical"
            className="mx-8 data-[orientation=vertical]:h-4"
          />
         <h1 className="text-lg font-medium sm:text-xl">panda🐼NEWS</h1>
         <div className="ml-auto">
            {/* <ModeToggle /> */}
          </div>
        </div>
      </header>
    </div>
  );
}