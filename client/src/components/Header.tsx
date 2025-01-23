import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useUI } from '../contexts/UIContext';

interface HeaderProps {
  title?: string; // Optional title to display in the header
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { toggleSidebarCollapsed } = useUI();

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm fixed w-full z-10">
      {/* Left: Hamburger Menu and Optional Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebarCollapsed}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
        {title && <h1 className="text-lg font-bold">{title}</h1>}
      </div>

      {/* Right: Notifications and Profile */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Notifications">
          <Bell size={24} />
        </button>
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwa"
          alt="User Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
        />
      </div>
    </header>
  );
};

export default Header;
