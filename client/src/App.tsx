import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import Header from './components/Header';
import { StudentDashboard } from './pages/StudentDashboard';
import { UIProvider } from './contexts/UIContext';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Profile } from './pages/Profile';
// ...import your Login and Signup components...

function MainLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const location = useLocation();
  const hideHeaderSidebarPaths = ['/login', '/signup'];
  const shouldShowHeaderSidebar = !hideHeaderSidebarPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowHeaderSidebar && (
      <Header title={location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)} />
      )}
      <div className={`pt-16 flex flex-1 ${!shouldShowHeaderSidebar ? 'pt-0' : ''}`}>
      {shouldShowHeaderSidebar && (
        <Sidebar />
      )}
      <main className="flex-1 p-6 md:p-8 bg-gray-50">
        <Routes>
        <Route path="/" element={<StudentDashboard />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        {/* ...other routes... */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <UIProvider>
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
    </UIProvider>
  );
}

export default App;
