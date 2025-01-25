import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { postRequest, getRequest, putRequest } from "../utils/services";
import { HrRegisterInfoType, studentRegisterInfoType } from "../types";

const BASE_URL = "http://localhost:3030/api/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

  const [registerError, setRegisterError] = useState<string | null>(null);
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

  const login = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(
        `${BASE_URL}/login`,
        JSON.stringify(loginInfo)
      );

      setIsLoginLoading(false);
      setLoginInfo({ username: "", password: "" });

      if (response.error) return setLoginError(response.error);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setJwtToken(token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    },
    [loginInfo] // dependencies
  );

  const studentRegister = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);
      if (studentRegisterInfo.username.length !== 10) {
        setIsRegisterLoading(false);
        return setRegisterError("Username must be exactly 10 characters long.");
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

      if (response.error) return setRegisterError(response.error);
      console.log("studentRegister Response: ", response.data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setJwtToken(token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    },
    [studentRegisterInfo] // dependencies
  );

  const hrRegister = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${BASE_URL}/addHr`, // check the url later
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

      if (response.error) return setRegisterError(response.error);

      const token = response.data.token;
      localStorage.setItem("token", token);
      setJwtToken(token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    },
    [HrRegisterInfo] // dependencies
  );

  const logout = async () => {
    localStorage.removeItem("token");
    setJwtToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          setAuthLoading(true);
          const response = await getRequest(`${BASE_URL}/user`, token);
          if (response.error) throw new Error(response.error);
          setUser(response.data.user);
          setIsAuthenticated(true);
          setJwtToken(token);
        } catch (error) {
          console.error("Failed to decode token or fetch user:", error);
          localStorage.removeItem("token");
          setUser(null);
          setJwtToken(null);
          setIsAuthenticated(false);
        } finally {
          setAuthLoading(false);
        }
      } else {
        setAuthLoading(false);
        logout();
      }
    };
    fetchUser();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isAuthenticated,
        jwtToken,
        loginInfo,
        loginError,
        isLoginLoading,
        registerError,
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

export interface User {}

export interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  jwtToken: string | null;
  loginInfo: { username: string; password: string };
  loginError: string | null;
  isLoginLoading: boolean;
  registerError: string | null;
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
}