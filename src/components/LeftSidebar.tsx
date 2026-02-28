import {
  HeartIcon,
  Home,
  LogOut,
  Search,
  User2,
  Sun,
  Moon,
} from "lucide-react";
import type { Iitems } from "@/types/types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { useState } from "react";
import { ModalPostThread } from "./ModalPostThread";

export function AppSidebar() {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const currentUser = useAppSelector((state) => state.profile.profile);
  const { theme, toggleTheme } = useTheme();

  const items: Iitems[] = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "Follows",
      url: "/follows",
      icon: HeartIcon,
    },
    {
      title: "Profile",
      url: `/profile/${currentUser?.id}`,
      icon: User2,
    },
    {
      title: "Theme",
      url: "#",
      icon: Sun,
    },
  ];

  return (
    <>
      <Sidebar side="left">
        <SidebarContent className="px-10">
          <SidebarGroup>
            <SidebarHeader className="text-6xl font-bold text-green-600 mb-5">
              circle
            </SidebarHeader>
            <SidebarGroupContent>
              <SidebarMenu className="flex gap-3">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.title === "Theme" ? (
                      <SidebarMenuButton asChild onClick={() => toggleTheme()}>
                        <div className="flex w-full items-center gap-2">
                          <div className="flex items-center gap-2">
                            {theme === "dark" ? (
                              <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            ) : (
                              <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            )}
                            <span className="text-lg">{item.title}</span>
                          </div>
                        </div>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon className="w-6 h-6" />
                          <span className="text-lg">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
                <Button
                  className="bg-green-600 mt-5 hover:bg-green-700 w-full rounded-full"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <span>Create Post</span>
                </Button>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="px-10 mb-5">
          <div className="flex flex-col gap-3 items-start">
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400 rounded-full w-[30%] justify-start gap-4"
            >
              <span className="flex flex-row items-center gap-2 ">
                <LogOut className="w-5 h-5" />
                Logout
              </span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <ModalPostThread
        avatar={currentUser?.avatar}
        name={currentUser?.name}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
