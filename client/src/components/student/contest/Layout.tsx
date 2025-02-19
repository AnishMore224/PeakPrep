import React from 'react';
// import { useLocation } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
import { useUIContext } from '../../../contexts/ui.context';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // const location = useLocation();
  // const navigate = useNavigate();
  const { isSidebarVisible } = useUIContext();
  // const showBackButton = location.pathname !== '/contest-main';

  return (
    <div
      className={`flex-1 py-6 sm:p-6 md:p-8  transition-all duration-300 ${isSidebarVisible ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
        }`}
    >
      <main className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;