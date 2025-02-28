import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { getRequest } from "../utils/services";
import { Hr } from "../types";
import { useAuth } from "./auth.context";
import { useError } from "./error.context";
import { jwtDecode } from "jwt-decode";

const ADMIN_BASE_URL = import.meta.env.VITE_DETAILS_API_URL;

const HrContext = createContext<HrContextProps | undefined>(undefined);

export interface HrContextProps {
  hrmembers: Hr[];
  getHrMembers: () => Promise<void>;
}

export const HrProvider = ({ children }: { children: ReactNode }) => {
  const [hrmembers, setHrMembers] = useState<Hr[]>([]);
  const { jwtToken } = useAuth();
  const { setError } = useError();
  const [token, setToken] = useState<string | null>(null);

  const getHrMembers = useCallback(async () => {
    if (!token) return;

    try {
      const response = await getRequest(`${ADMIN_BASE_URL}/hrs`, token);
      if (response.success) {
        setHrMembers(response.data.hrsData);
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError(error as string);
    }
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!token) {
      setHrMembers([]);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded?.role === "admin") {
        getHrMembers();
      } else {
        setHrMembers([]);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setHrMembers([]);
    }
  }, [token, getHrMembers, jwtToken]); // Depend on jwtToken to trigger re-run when it updates

  return (
    <HrContext.Provider value={{ hrmembers, getHrMembers }}>
      {children}
    </HrContext.Provider>
  );
};

export const useHr = () => {
  const context = useContext(HrContext);
  if (!context) {
    throw new Error("useHr must be used within a HrProvider");
  }
  return context;
};
