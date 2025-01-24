import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  History, 
  MessageSquare, 
  Bot,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { NavItem, SidebarProps } from '../types';

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'companies', label: 'Shortlisted companies', icon: Building2, href: '/companies' },
  { id: 'past', label: 'Past companies', icon: History, href: '/past' },
  { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare, href: '/feedbacks' },
  { id: 'chatbot', label: 'ChatBot', icon: Bot, href: '/chatbot' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
        md:relative
      `}
      aria-label="Sidebar navigation"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          <h1 className={`font-bold text-xl ${isCollapsed ? 'hidden' : 'block'}`}>
            DashBoard
          </h1>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`
                flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100
                ${isCollapsed ? 'justify-center' : ''}
              `}
              aria-label={item.label}
            >
              {/* <item.icon size={24} /> */}
              <item.icon />
              {!isCollapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4">
          <button
            className={`
              flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-gray-100
              ${isCollapsed ? 'justify-center' : ''}
            `}
            aria-label="Sign out"
          >
            <LogOut size={24} />
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};