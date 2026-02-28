import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/LeftSidebar";
import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { GetThread } from "@/hooks/threadSlice";
import { GetAllProfiles, GetProfile } from "@/hooks/profileSlice";
import { useSocket } from "@/hooks/useSocket";
import { useAlert } from "@/context/AlertContext";
import { ProfileSideBar } from "../../components/ProfileSide";

export const HomePage = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const threadState = useAppSelector((state) => state.thread);
  const [active, setActive] = useState(false);
  const { showError } = useAlert();

  // 🔌 Initialize Socket.io connection dan real-time listeners
  useSocket();

  useEffect(() => {
    if (!token || threadState.error) {
      navigate("/login");
    }
  }, [navigate, token, threadState.error]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        await dispatch(GetThread()).unwrap();
      } catch (error) {
        console.error("Failed to fetch threads:", error);
        showError("Failed to fetch threads. Please try again later.");
      }
    };

    fetchThreads();
  }, [dispatch, showError]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await dispatch(GetProfile()).unwrap();
        await dispatch(GetAllProfiles()).unwrap();
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        showError("Failed to fetch profile. Please try again later.");
      }
    };

    fetchProfile();
  }, [dispatch, showError]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="sticky top-0 z-20 bg-background dark:bg-sidebar border-b border-border pb-3">
          <SidebarTrigger onClick={() => setActive(!active)} />
        </div>
        {/* Outlet akan me-render child route (ThreadList atau DetailThreadPage) */}
        <Outlet />
      </main>
      <ProfileSideBar />
    </SidebarProvider>
  );
};
