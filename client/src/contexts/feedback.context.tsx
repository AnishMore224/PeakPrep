import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { getRequest } from "../utils/services";
import { Feedback } from "../types";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./auth.context";
const BASE_URL = "http://localhost:3030/api/feedback";
const FeedbackContext = createContext<FeedbackContextProps | undefined>(
  undefined
);
export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const getFeedbacks = useCallback(async () => {
    const response = await getRequest(`${BASE_URL}/feedbacks`, token);
    if (response.success) {
      setFeedbacks(response.data);
    }
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      if (decode && (decode as any)?.role !== "student") {
        return;
      }
    } else return;
    getFeedbacks();
  }, [getFeedbacks, user]);
  return (
    <FeedbackContext.Provider value={{ feedbacks, getFeedbacks }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export interface FeedbackContextProps {
  feedbacks: Feedback[];
  getFeedbacks: () => void;
}

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
