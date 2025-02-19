import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { UIProvider } from "./contexts/ui.context";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import LoadingScreen from "./pages/LoadingScreen";
import { AuthProvider, useAuth } from "./contexts/auth.context";
import ShortListedCompanies from "./pages/student/ShortListedCompanies";
import ChatBot from "./pages/student/ChatBot";
import Feedbacks from "./pages/student/Feedbacks";
import { StudentFeedback } from "./pages/hr/Feedbackform";
import AdminDashboard from "./pages/admin/AdminDashBoard";
import { HRDashboard } from "./pages/hr/HrDashboard";
import { FeedbackProvider } from "./contexts/feedback.context";
import { StudentProvider } from "./contexts/student.context";
import { CompanyProvider } from "./contexts/company.context";
import NotAuthorized from "./pages/NotAuthorized";
import { AllCandidate } from "./pages/admin/Candidates";
import AllCompanies from "./pages/admin/Companies";
import Hrs from "./pages/admin/Hrs";
import { HrProvider } from "./contexts/hr.context";
import ATS from "./pages/student/ats/atsScore"; // Import the AtsScore component
import OpenSource from "./pages/student/OpenSource";
import StudentContestHome from "./pages/student/contest/Home";
import AdminContestHome from "./pages/admin/contest/Home";
import ResumeForm from "./pages/student/resume-builder/ResumeForm";
import { ContestProvider } from "./contexts/contest.context";
import { Candidate } from "./pages/hr/Candidates";
import ResourcesPage from "./pages/student/ResourcesPage";
import NotFound from "./pages/NotFound";
import CodeEditor from "./pages/student/contest/CodeEditor";
import { Interview } from "./pages/admin/Interview";
import { InterviewResults } from "./pages/admin/InterviewResults";
import CreateContest from "./pages/admin/contest/CreateContest";
import StudentDailyContestDetails from "./pages/student/contest/details/DailyContestDetails";
import StudentCodingContestDetails from "./pages/student/contest/details/CodingContestDetails";
import AdminDailyContestDetails from "./pages/admin/contest/details/DailyContestDetails";
import AdminCodingContestDetails from "./pages/admin/contest/details/CodingContestDetails";
import { getHeaderTitle } from "./utils/functions";
import Verification from "./pages/Verification";
import Password from "./pages/Password";

function MainLayout() {
  const location = useLocation();
  const hideHeaderSidebarPaths = [
    "/login",
    "/signup",
    "/codeEditor",
    "/interview",
    "/interview-result",
    "/verify-email",
    "/change-password",
  ];
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
        <Header title={getHeaderTitle(location.pathname)} />
      )}
      <div
        className={`flex flex-1 h-full ${
          !shouldShowHeaderSidebar ||
          location.pathname === "/weekly-contest" ||
          location.pathname === "/daily-contest"
            ? "pt-0"
            : "pt-15"
        }`}
      >
        {shouldShowHeaderSidebar && <Sidebar />}
        <main
          className={`flex-1 h-full ${
            !shouldShowHeaderSidebar || location.pathname === "/chatbot"
              ? "bg-gray-50 p-0"
              : "sm:p-6 md:p-8 p-2"
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

            <Route
              path="/feedbackform"
              element={
                isAuthenticated ? (
                  user?.role === "hr" || user?.role === "admin" ? (
                    <StudentFeedback />
                  ) : (
                    <NotAuthorized />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/resume"
              element={
                isAuthenticated ? (
                  user?.role === "student" ? (
                    <ResumeForm />
                  ) : (
                    <NotAuthorized />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/atsChecker"
              element={
                isAuthenticated ? (
                  user?.role === "student" ? (
                    <ATS />
                  ) : (
                    <NotAuthorized />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/openSource"
              element={
                isAuthenticated ? (
                  user?.role === "student" ? (
                    <OpenSource />
                  ) : (
                    <NotAuthorized />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/resources"
              element={
                isAuthenticated ? (
                  user?.role === "student" ? (
                    <ResourcesPage />
                  ) : (
                    <NotAuthorized />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/contest"
              element={
                isAuthenticated ? (
                  user?.role === "student" ? (
                    <StudentContestHome />
                  ) : user?.role === "admin" ? (
                    <AdminContestHome />
                  ) : (
                    <NotAuthorized />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/contest/create"
              element={
                isAuthenticated ? (
                  user?.role === "admin" ? (
                    <CreateContest />
                  ) : (
                    <NotAuthorized />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/contest/daily/:id"
              element={
                isAuthenticated ? (
                  user?.role === "admin" ? (
                    <AdminDailyContestDetails />
                  ) : user?.role === "student" ? (
                    <StudentDailyContestDetails />
                  ) : (
                    <NotAuthorized />
                  )
                ) : (
                  <Navigate to="/login" state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/contest/coding/:id"
              element={
                isAuthenticated ? (
                  user?.role === "student" ? (
                    <StudentCodingContestDetails />
                  ) : user?.role === "admin" ? (
                    <AdminCodingContestDetails />
                  ) : (
                    <NotAuthorized />
                  )
                ) : (
                  <Navigate to={"/login"} state={{ from: location }} replace />
                )
              }
            />
            <Route
              path="/verify-email"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : user ? (
                  <Verification />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/change-password" element={
              isAuthenticated ? (
                <Password />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/codeEditor" element={<CodeEditor />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/interview-result" element={<InterviewResults />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <CompanyProvider>
            <StudentProvider>
              <HrProvider>
                <FeedbackProvider>
                  <ContestProvider>
                    <MainLayout />
                  </ContestProvider>
                </FeedbackProvider>
              </HrProvider>
            </StudentProvider>
          </CompanyProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
