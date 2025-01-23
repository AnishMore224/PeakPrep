import React from 'react';
import {
  LayoutDashboard,
  Building2,
  History,
  MessageSquare,
  Bot,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { NavItem } from '../types';
import { useUI } from '../contexts/UIContext';
import { SidebarProps } from '../types';

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'companies', label: 'Shortlisted companies', icon: Building2, href: '/companies' },
  { id: 'past', label: 'Past companies', icon: History, href: '/past' },
  { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare, href: '/feedbacks' },
  { id: 'chatbot', label: 'ChatBot', icon: Bot, href: '/chatbot' },
];

export const Sidebar: React.FC<SidebarProps> = () => {
  const { isSidebarCollapsed, toggleSidebarCollapsed } = useUI();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300
        ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        md:block
      `}
      aria-label="Sidebar navigation"
    >
      <div className="flex h-full flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4">
          <h1 className={`font-bold text-xl transition-all duration-300 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
            Dashboard
          </h1>
          <button
            onClick={toggleSidebarCollapsed}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`
                flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
              aria-label={item.label}
            >
              <item.icon />
              {!isSidebarCollapsed && <span className="text-sm">{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Sign-out Section */}
        <div className="p-4">
          <button
            className={`
              flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-gray-100
              ${isSidebarCollapsed ? 'justify-center' : ''}
            `}
            aria-label="Sign out"
          >
            <LogOut size={24} />
            {!isSidebarCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
