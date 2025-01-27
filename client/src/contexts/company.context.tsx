import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { postRequest, getRequest } from "../utils/services";
import { Company } from "../types";

const BASE_URL = "http://localhost:3030/api/studentSelection";

const CompanyContext = createContext<CompanyContextProps | undefined>(
  undefined
);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);

  const getCompanies = useCallback(async () => {
    const response = await getRequest(`${BASE_URL}/companies`);
    if (response.success) {
      setCompanies(response.data);
    }
  }, []);

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  return (
    <CompanyContext.Provider value={{ companies, getCompanies }}>
      {children}
    </CompanyContext.Provider>
  );
};

export interface CompanyContextProps {
  companies: Company[];
  getCompanies: () => void;
}

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};

export default CompanyContext;
