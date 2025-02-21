import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Bot,
  History,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UsersRound,
  FileUser,
  Code,
  Book,
  Brain,
} from "lucide-react";
import { NavItem } from "../types";
import { useUIContext } from "../contexts/ui.context";
import { useAuth } from "../contexts/auth.context";

const studentNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    fun: () => {},
  },
  {
    id: "companies",
    label: "Companies",
    icon: Building2,
    href: "/companies",
    fun: () => {},
  },
  {
    id: "feedbacks",
    label: "Feedbacks",
    icon: MessageSquare,
    href: "/feedbacks",
    fun: () => {},
  },
  {
    id: "atschecker",
    label: "ATS Checker",
    icon: FileUser,
    href: "/atschecker",
    fun: () => {},
  },
  {
    id: "Open Source",
    label: "Open Source",
    icon: Code,
    href: "/openSource",
    fun: () => {},
  },
  {
    id: "Resorces",
    label: "Resources",
    icon: Book,
    href: "/resources",
    fun: () => {},
  },
  {
    id: "chatbot",
    label: "ChatBot",
    icon: Bot,
    href: "/chatbot",
    fun: () => {},
  },
  {
    id: "contests",
    label: "Contests",
    icon: Brain,
    href: "/contest",
    fun: () => {},
  } 
];

const hrNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    fun: () => {},
  },
  {
    id: "candidates",
    label: "Candidates",
    icon: FileUser,
    href: "/candidates",
    fun: () => {},
  },
  {
    id: "interviews",
    label: "Interviews",
    icon: History,
    href: "/interviews",
    fun: () => {},
  },
  // { id: "feedbacks", label: "Feedbacks", icon: MessageSquare, href: "/feedbacks" },
];

const adminNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    fun: () => {},
  },
  {
    id: "candidates",
    label: "Candidates",
    icon: FileUser,
    href: "/allcandidates",
    fun: () => {},
  },
  {
    id: "companies",
    label: "Companies",
    icon: Building2,
    href: "/allcompanies",
    fun: () => {},
  },
  { id: "hrs", label: "HRs", icon: UsersRound, href: "/hrs", fun: () => {} },
  {
    id: "contests",
    label: "Contests",
    icon: Brain,
    href: "/contest",
    fun: () => {},
  } 
];
const Sidebar: React.FC = () => {
  const { isSidebarVisible, toggleSidebar, hamburgerRef } = useUIContext();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Close sidebar if clicked outside
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar if clicked outside (excluding the hamburger button)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        if (isSidebarVisible) {
          toggleSidebar();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }
, [isSidebarVisible, toggleSidebar]);

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
    ref={sidebarRef}
      className={`
    fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 
     md:overflow-y-auto overflow-y-auto z-10
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
              onClick={() => {
                item.fun();
                navigate(item.href);
              }}
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
            onClick={logout}
          >
            <LogOut size={24} />
            {isSidebarVisible && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;