import React, { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Header from "./components/Header";
import { StudentDashboard } from "./pages/StudentDashboard";
import { UIProvider } from "./contexts/UIContext";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";

function MainLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const location = useLocation();
  const hideHeaderSidebarPaths = ["/login", "/signup"];
  const shouldShowHeaderSidebar = !hideHeaderSidebarPaths.includes(
    location.pathname
  );

  return (
    <>
      {shouldShowHeaderSidebar && (
        <Header
          title={
            location.pathname === "/"
              ? "Dashboard"
              : location.pathname.substring(1)
          }
        />
      )}
      <div
        className={`flex flex-1 ${
          !shouldShowHeaderSidebar ? "pt-0" : "pt-16"
        }`}
      >
        {shouldShowHeaderSidebar && <Sidebar />}
        <main
          className={`flex-1 ${
            shouldShowHeaderSidebar ? "p-6 md:p-8 bg-gray-50" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </>
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