import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { deleteRequest, getRequest } from "../utils/services";
import { Asset } from "../types";

const BASE_URL = "http://localhost:3030/api/cloudinary"; // Replace with your actual base URL

interface DocumentContextProps {
  documents: Asset[];
  setDocuments: (documents: Asset[]) => void;
  deleteDocument: (public_id: string, resource_type: string) => void;
}

const DocumentContext = createContext<DocumentContextProps | undefined>(
  undefined
);

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({
  children,
}) => {
  const [documents, setDocuments] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const getDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await getRequest(`${BASE_URL}/getAsset`, token);
      if (response.data) {
        setDocuments(response.data.assets);
        console.log("response", response.data.assets);
      } else {
        setError(response?.error || "Failed to fetch documents");
      }
    } catch {
      setError("Failed to fetch documents");
    }
  };

  const deleteDocument = async (public_id: string, resource_type: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await deleteRequest(
        `${BASE_URL}/deleteAsset`,
        JSON.stringify({ public_id, resource_type }),
        token
      );
      console.log("response", response.json());
      if (response.success) {
        setDocuments(documents.filter((doc) => doc.public_id !== public_id));
      } else {
        setError(response?.error || "Failed to delete document");
      }
    } catch {
      setError("Failed to delete document");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!token) {
      setDocuments([]);
      return;
    }
    getDocuments();
  }, [token]);
  return (
    <DocumentContext.Provider
      value={{ documents, setDocuments, deleteDocument }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
