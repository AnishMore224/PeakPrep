export function getHeaderTitle(path: string): string {
    // Remove any query parameters or hash fragments for clean matching
    const cleanPath = path.split(/[?#]/)[0];
  
    switch (true) {
      case cleanPath === "/":
        return "Dashboard";
      case cleanPath === "/login":
        return "Login";
      case cleanPath === "/signup":
        return "Sign Up";
      case cleanPath === "/profile":
        return "Profile";
      case cleanPath === "/companies":
        return "Short Listed Companies";
      case cleanPath === "/candidates":
        return "Candidates";
      case cleanPath === "/chatbot":
        return "Chat Bot";
      case cleanPath === "/feedbacks":
        return "Feedbacks";
      case cleanPath === "/allcompanies":
        return "All Companies";
      case cleanPath === "/allcandidates":
        return "All Candidates";
      case cleanPath === "/hrs":
        return "HR Dashboard";
      case cleanPath === "/feedbackform":
        return "Student Feedback";
      case cleanPath === "/resume":
        return "Resume Form";
      case cleanPath === "/atschecker":
        return "ATS Checker";
      case cleanPath === "/openSource":
        return "Open Source";
      case cleanPath === "/resources":
        return "Resources";
      case cleanPath === "/contest":
        return "Contest Home";
      case cleanPath === "/contest/create":
        return "Create Contest";
      case cleanPath.startsWith("/contest/daily/"):
        return "Daily Contest Details";
      case cleanPath.startsWith("/contest/coding/"):
        return "Coding Contest Details";
      case cleanPath === "/test1":
        return "Score Gauge";
      case cleanPath === "/codeEditor":
        return "Code Editor";
      case cleanPath === "/interview":
        return "Interview";
      case cleanPath === "/interview-result":
        return "Interview Results";
      default:
        return "Page";
    }
  }