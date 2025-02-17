import React from "react";

type TabType = "overview" | "questions" | "rankings" | "settings";

interface TabButtonProps {
  tab: TabType;
  icon: React.ReactNode;
  label: string;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, icon, label, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
      ${activeTab === tab 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-600 hover:bg-blue-50'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default TabButton;