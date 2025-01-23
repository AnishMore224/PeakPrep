import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { StudentDashboard } from './pages/StudentDashboard';
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isVisible={isSidebarVisible}
          onClose={() => setIsSidebarVisible(false)}
        />
        <div className="flex-1">
          <Header title="Dashboard" />
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
