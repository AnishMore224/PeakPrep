export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  href: string;
}

export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  change?: number;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  type: "interview" | "review" | "practice" | "analytics";
}

export interface SidebarProps {
  isCollapsed: boolean; // Controls whether the sidebar is collapsed
  onToggle: () => void; // Function to toggle the collapse state
  isVisible?: boolean; // Controls visibility of the sidebar (used for smaller screens)
  onClose?: () => void; // Function to close the sidebar on smaller screens
}

export interface LoginForm {
  email: string;
  password: string;
  keepSignedIn: boolean;
}

export interface SignUpForm {
  userType: 'student' | 'hr';
  name: string;
  username: string;
  email: string;
  password: string;
  branch?: string;
  section?: string;
  company?: string;
  collegeId?: string;
}

export interface ProfileField {
  label: string;
  value: string;
  type?: string;
  fullWidth?: boolean;
}

export interface Document {
  name: string;
  type: string;
  editable?: boolean;
}

export interface DocumentSectionProps {
  title: string;
  documents: Document[];
  showUpload?: boolean;
}