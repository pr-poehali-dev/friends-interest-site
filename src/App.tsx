import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import ProfilesPage from "./pages/ProfilesPage";
import FriendPage from "./pages/FriendPage";
import GroupChatPage from "./pages/GroupChatPage";
import DirectChatPage from "./pages/DirectChatPage";
import GalleryPage from "./pages/GalleryPage";
import SettingsPage from "./pages/SettingsPage";
import InvitesPage from "./pages/InvitesPage";
import Sidebar from "./components/Sidebar";

export type Page =
  | "home"
  | "profiles"
  | "friend"
  | "group-chat"
  | "direct-chat"
  | "gallery"
  | "settings"
  | "invites";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedFriend, setSelectedFriend] = useState<string>("Алина");
  const [selectedChat, setSelectedChat] = useState<string>("Алина");

  const navigate = (p: Page, extra?: string) => {
    if (p === "friend" && extra) setSelectedFriend(extra);
    if (p === "direct-chat" && extra) setSelectedChat(extra);
    setPage(p);
  };

  const renderPage = () => {
    switch (page) {
      case "home":       return <HomePage navigate={navigate} />;
      case "profiles":   return <ProfilesPage navigate={navigate} />;
      case "friend":     return <FriendPage name={selectedFriend} navigate={navigate} />;
      case "group-chat": return <GroupChatPage navigate={navigate} />;
      case "direct-chat":return <DirectChatPage name={selectedChat} navigate={navigate} />;
      case "gallery":    return <GalleryPage navigate={navigate} />;
      case "settings":   return <SettingsPage navigate={navigate} />;
      case "invites":    return <InvitesPage navigate={navigate} />;
      default:           return <HomePage navigate={navigate} />;
    }
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="flex min-h-screen bg-background relative">
        <div className="bg-mesh" />
        <Sidebar page={page} navigate={navigate} />
        <main className="flex-1 relative z-10 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </TooltipProvider>
  );
}
