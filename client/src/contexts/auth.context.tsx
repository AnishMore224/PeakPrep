import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { postRequest, getRequest } from "../utils/services";
import { HrRegisterInfoType, studentRegisterInfoType } from "../types";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useError } from "./error.context";

const BASE_URL = import.meta.env.VITE_AUTH_API_URL as string;

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { setError } = useError();
  const [user, setUser] = useState<Admin | Student | Hr | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  const [studentRegisterInfo, setStudentRegisterInfo] =
    useState<studentRegisterInfoType>({
      username: "",
      email: "",
      name: "",
      branch: "",
      section: "",
      password: "",
    });

  const [HrRegisterInfo, setHrRegisterInfo] = useState<HrRegisterInfoType>({
    username: "",
    email: "",
    name: "",
    collegeId: "",
    company: "",
    password: "",
  });

  const updateLoginInfo = useCallback(
    (info: { username: string; password: string }) => {
      setLoginInfo(info);
    },
    []
  );

  const updateStudentRegisterInfo = useCallback(
    (info: studentRegisterInfoType) => {
      setStudentRegisterInfo(info);
    },
    []
  );

  const updateHrRegisterInfo = useCallback((info: HrRegisterInfoType) => {
    setHrRegisterInfo(info);
  }, []);

  const encryptEmail = (email: string): string => {
    return btoa(email);
  };

  const login = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsLoginLoading(true);
      setError(null);  
      const response = await postRequest(
        `${BASE_URL}/login`,
        JSON.stringify(loginInfo)
      );

      setIsLoginLoading(false);
      setLoginInfo({ username: "", password: "" });

      if (response.error) {
        return setError(response.error);
      }
      const token = response.data.token;
      localStorage.setItem("token", token);
      setJwtToken(token);
      // decode token and set role
      const decoded: any = jwtDecode(token);
      const role = decoded.role;
      if (role === "student") {
        const { email, name, branch, section } = { ...response.data.user };
        const student = {
          role,
          username: decoded.username,
          email,
          name,
          branch,
          section,
        };
        setUser(student);
      } else if (role === "hr") {
        const { role, email, name, companyName } = { ...response.data.user };
        const hr = { role, email, name, companyName, username: email };
        setUser(hr);
      } else if (role === "admin") {
        const { role, username, email, name } = { ...response.data.user };
        const admin = { role, username, email, name };
        setUser(admin);
      }
      const isEmailVerified = response.data.user.verified;
      setIsEmailVerified(isEmailVerified);
      if (!isEmailVerified) {
        console.log("Redirecting to verification page");
        const email = encryptEmail(response.data.user.email);
        return navigate(`/verify-email?email=${email}`); // Redirect to verification page with email
      }
      setIsAuthenticated(true);
    },
    [loginInfo] // dependencies
  );

  const studentRegister = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsRegisterLoading(true);
      setError(null);
      if (studentRegisterInfo.username.length !== 10) {
        setIsRegisterLoading(false);
        return setError("Username must be exactly 10 characters long.");
      }
      const response = await postRequest(
        `${BASE_URL}/register`,
        JSON.stringify(studentRegisterInfo)
      );

      setIsRegisterLoading(false);
      setStudentRegisterInfo({
        username: "",
        email: "",
        name: "",
        branch: "",
        section: "",
        password: "",
      });

      if (response.error) return setError(response.error);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setJwtToken(token);
      setUser(response.data.user);
      const { username, email, name, branch, section } = {
        ...response.data.user,
      };
      const student = {
        role: "student",
        username,
        email,
        name,
        branch,
        section,
      };
      setUser(student);
      const isEmailVerified = response.data.user.verified;
      setIsEmailVerified(isEmailVerified);
      if (!isEmailVerified) {
        const email = encryptEmail(response.data.user.email);
        return navigate(`/verify-email?email=${email}`); // Redirect to verification page with email
      }
      setIsAuthenticated(true);
    },
    [studentRegisterInfo] // dependencies
  );

  const hrRegister = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsRegisterLoading(true);
      setError(null);
      const collegeId = import.meta.env.VITE_COLLEGE_ID;
      if (HrRegisterInfo.collegeId !== collegeId) {
        setIsRegisterLoading(false);
        return setError("Invalid College ID");
      }
      const response = await postRequest(
        `${BASE_URL}/registerHr`,
        JSON.stringify(HrRegisterInfo)
      );

      setIsRegisterLoading(false);
      setHrRegisterInfo({
        username: "",
        email: "",
        name: "",
        collegeId: "",
        company: "",
        password: "",
      });

      if (response.error) return setError(response.error);

      const token = response.data.token;
      localStorage.setItem("token", token);
      setJwtToken(token);
      const { role, email, name, companyName } = { ...response.data.user };
      const hr = {
        role,
        email,
        name,
        companyName,
        username: HrRegisterInfo.username,
      };
      setUser(hr);
      const isEmailVerified = response.data.user.verified;
      setIsEmailVerified(isEmailVerified);
      if (!isEmailVerified) {
        const email = encryptEmail(response.data.user.email);
        return navigate(`/verify-email?email=${email}`); // Redirect to verification page with email
      }
      setIsAuthenticated(true);
    },
    [HrRegisterInfo] // dependencies
  );

  const logout = async () => {
    localStorage.removeItem("token");
    setJwtToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsEmailVerified(false);
  };

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          setAuthLoading(true);
          const response = await getRequest(`${BASE_URL}/user`, token);
          if (response.error) throw new Error(response.error);
          setJwtToken(token);
          const decoded: any = jwtDecode(token);
          const role = decoded.role;
          if (role === "student") {
            const { email, name, branch, section } = {
              ...response.data.user,
            };
            const student = {
              role,
              username: decoded.username,
              email,
              name,
              branch,
              section,
            };
            setUser(student);
          } else if (role === "hr") {
            const { role, email, name, companyName } = { ...response.data.user };
            const hr = { role, email, name, companyName, username: email };
            setUser(hr);
          } else if (role === "admin") {
            const { role, username, email, name } = { ...response.data.user };
            const admin = { role, username, email, name };
            setUser(admin);
          }
          const isEmailVerified = response.data.user.verified;
          setIsEmailVerified(isEmailVerified);
          if (!isEmailVerified) {
            navigate(`/verify-email`); // Redirect to verification page
            return;
          } 
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to decode token or fetch user:", error);
          localStorage.removeItem("token");
          setUser(null);
          setJwtToken(null);
          setIsAuthenticated(false);
          setIsEmailVerified(false);
        } finally {
          setAuthLoading(false);
        }
      } else {
        setAuthLoading(false);
        logout();
      }
    };
    fetchUser();
  }, [isEmailVerified]); // Empty dependency array ensures this runs only once

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isAuthenticated,
        jwtToken,
        loginInfo,
        isLoginLoading,
        isRegisterLoading,
        studentRegisterInfo,
        hrRegisterInfo: HrRegisterInfo,
        updateLoginInfo,
        updateStudentRegisterInfo,
        updateHrRegisterInfo,
        studentRegister,
        hrRegister,
        login,
        authLoading,
        isEmailVerified,
        setIsEmailVerified
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export interface Admin {
  role: string;
  username: string;
  email: string;
  name: string;
}

export interface Student {
  role: string;
  username: string;
  email: string;
  name: string;
  branch: string;
  section: string;
}

export interface Hr {
  role: string;
  username: string;
  email: string;
  name: string;
  companyName: string;
}

export interface AuthContextType {
  user: Student | Hr | Admin | null;
  logout: () => void;
  isAuthenticated: boolean;
  jwtToken: string | null;
  loginInfo: { username: string; password: string };
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  studentRegisterInfo: studentRegisterInfoType;
  hrRegisterInfo: HrRegisterInfoType;
  updateLoginInfo: (info: { username: string; password: string }) => void;
  updateStudentRegisterInfo: (info: studentRegisterInfoType) => void;
  updateHrRegisterInfo: (info: HrRegisterInfoType) => void;
  studentRegister: (event: any) => void;
  hrRegister: (event: any) => void;
  login: (event: any) => void;
  authLoading: boolean;
  isEmailVerified: boolean;
  setIsEmailVerified: React.Dispatch<React.SetStateAction<boolean>>;
}
