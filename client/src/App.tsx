import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Header from "./components/Header";
import { StudentDashboard } from "./pages/StudentDashboard";
import { UIProvider } from "./contexts/ui.context";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import LoadingScreen from "./pages/LoadingScreen";
import { AuthProvider, useAuth } from "./contexts/auth.context";
import ShortListedCompanies from "./pages/ShortListedCompanies";
import ChatBot from "./pages/ChatBot";
import Feedbacks from "./pages/Feedbacks";
import FeedbackForm from "./pages/Feedbackform";

import AdminDashboard from "./pages/AdminDashBoard";
import { Candidate } from "./pages/Candidates";
// import { AdminDashboard } from "./pages/AdminDashboard";
import { HRDashboard } from "./pages/HrDashboard";
import { FeedbackProvider } from "./contexts/feedback.context";
import { StudentProvider } from "./contexts/student.context";
import { CompanyProvider } from "./contexts/company.context";
import AllCompanies from "./pages/admin/companies";
import NotAuthorized from "./pages/NotAuthorized";
import { AllCandidate } from "./pages/admin/Candidates";
import ResumeForm from "./pages/resume-builder/ResumeForm";
import Hrs from "./pages/admin/Hrs";
import { HrProvider } from "./contexts/hr.context";

function MainLayout() {
  const location = useLocation();
  const hideHeaderSidebarPaths = ["/login", "/signup"];
  const shouldShowHeaderSidebar = !hideHeaderSidebarPaths.includes(
    location.pathname
  );
  const { isAuthenticated, authLoading, user } = useAuth();

  // Global loading state
  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {shouldShowHeaderSidebar && (
        <Header
          title={
            location.pathname === "/"
              ? "Dashboard"
              : location.pathname
                  .substring(1)
                  .replace(/(^|\s)\S/g, (t) => t.toUpperCase())
          }
        />
      )}
      <div
        className={`flex flex-1 ${!shouldShowHeaderSidebar ? "pt-0" : "pt-15"}`}
      >
        {shouldShowHeaderSidebar && <Sidebar />}
        <main
          className={`flex-1 ${
            !shouldShowHeaderSidebar || location.pathname === "/chatbot"
              ? "bg-gray-50 p-0"
              : "p-6 md:p-8"
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  user?.role === "student" ? (
                    <StudentDashboard />
                  ) : user?.role === "admin" ? (
                    <AdminDashboard />
                  ) : (
                    <HRDashboard />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <SignUp />
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <Profile />
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/companies"
              element={
                isAuthenticated ? (
                  <ShortListedCompanies />
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/candidates"
              element={
                isAuthenticated ? (
                  <Candidate />
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/ChatBot"
              element={
                isAuthenticated ? (
                  <ChatBot />
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/feedbacks"
              element={
                isAuthenticated ? (
                  <Feedbacks />
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/allcompanies"
              element={
                isAuthenticated ? (
                  user?.role !== "admin" ? (
                    <NotAuthorized />
                  ) : (
                    <AllCompanies />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/allcandidates"
              element={
                isAuthenticated ? (
                  user?.role !== "admin" ? (
                    <NotAuthorized />
                  ) : (
                    <AllCandidate />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/hrs"
              element={
                isAuthenticated ? (
                  user?.role !== "admin" ? (
                    <NotAuthorized />
                  ) : (
                    <Hrs />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route path="/feedbackform" element={<FeedbackForm />} />
            <Route path="/resume" element={<ResumeForm />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <CompanyProvider>
          <StudentProvider>
            <HrProvider>
              <FeedbackProvider>
                <BrowserRouter>
                  <MainLayout />
                </BrowserRouter>
              </FeedbackProvider>
            </HrProvider>
          </StudentProvider>
        </CompanyProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
