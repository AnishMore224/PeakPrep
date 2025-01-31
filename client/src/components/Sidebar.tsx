import React from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  History,
  MessageSquare,
  Bot,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { NavItem } from "../types";
import { useUIContext } from "../contexts/ui.context";
import { useAuth } from "../contexts/auth.context";

const studentNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  {
    id: "companies",
    label: "Companies",
    icon: Building2,
    href: "/companies",
  },
  {
    id: "feedbacks",
    label: "Feedbacks",
    icon: MessageSquare,
    href: "/feedbacks",
  },
  { id: "chatbot", label: "ChatBot", icon: Bot, href: "/chatbot" },
];

const hrNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "candidates", label: "Candidates", icon: Building2, href: "/candidates" },
  { id: "interviews", label: "Interviews", icon: History, href: "/interviews" },
  // { id: "feedbacks", label: "Feedbacks", icon: MessageSquare, href: "/feedbacks" },
];

const adminNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "users", label: "Users", icon: Building2, href: "/users" },
  { id: "settings", label: "Settings", icon: History, href: "/settings" },
  { id: "logs", label: "Logs", icon: MessageSquare, href: "/logs" },
];

export const Sidebar: React.FC = () => {
  const { isSidebarVisible, toggleSidebar } = useUIContext();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  let navItems: NavItem[] = [];
  if (user?.role === "student") {
    navItems = studentNavItems;
  } else if (user?.role === "hr") {
    navItems = hrNavItems;
  } else if (user?.role === "admin") {
    navItems = adminNavItems;
  }

  return (
    <aside
      className={`
    fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300
     md:overflow-y-auto overflow-y-scroll z-10
    ${isSidebarVisible ? "block" : "hidden"} 
    md:block 
    ${!isSidebarVisible ? "md:w-20" : "md:w-64"}
  `}
    >
      <div className="flex h-full flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4">
          <h1
            className={`font-bold text-xl transition-all duration-300 ${
              !isSidebarVisible ? "hidden" : "block"
            }`}
          >
            Dashboard
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label={
              !isSidebarVisible ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {!isSidebarVisible ? (
              <ChevronRight size={24} />
            ) : (
              <ChevronLeft size={24} />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              onClick={() => navigate(item.href)}
              className={`
                flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100
                ${!isSidebarVisible ? "justify-center" : ""}
              `}
              aria-label={item.label}
            >
              <item.icon />
              {isSidebarVisible && (
                <span className="text-sm">{item.label}</span>
              )}
            </a>
          ))}
        </nav>

        {/* Sign-out Section */}
        <div className="p-4">
          <button
            className={`
              flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-gray-100
              ${!isSidebarVisible ? "justify-center" : ""}
            `}
            aria-label="Sign out"
          >
            <LogOut onClick={logout} size={24} />
            {isSidebarVisible && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
