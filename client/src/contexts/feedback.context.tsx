import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { getRequest, postRequest } from "../utils/services";
import { Feedback,FeedbackAdd } from "../types";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./auth.context";
import { useError } from "./error.context";
const BASE_URL = import.meta.env.VITE_FEEDBACK_API as string;
const FeedbackContext = createContext<FeedbackContextProps | undefined>(
  undefined
);
export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedback, setFeedback] = useState<FeedbackAdd | null>(null);
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const  { setError } = useError();
  const getFeedbacks = useCallback(async () => {
    const response = await getRequest(`${BASE_URL}/feedbacks`, token);
    if (response.success) {
      setFeedbacks(response.data);
    }
  }, [token]);


  const getFeedback = useCallback(async (studentId:string) => {
    const response = await getRequest(`${BASE_URL}/feedback?studentId=${studentId}`, token);
    if (response.success) {
      return response.data;
    } else {
      setError(response.error);
    }
  }, [token]);
  
  const addFeedback = useCallback(async (feedback: FeedbackAdd) => {
     const response = await postRequest(`${BASE_URL}/addFeedback`, JSON.stringify(feedback), token);
      if (response.success) {
        setFeedback(feedback);
      } else {
        setError(response.error);
      }
    }, [token]);

  const updateFeedback = useCallback(async (feedback: FeedbackAdd) => {
    const response = await postRequest(`${BASE_URL}/updateFeedback`, JSON.stringify(feedback), token);
    if (response.success) {
      setFeedback(feedback);
    } else {
      setError(response.error);
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
  }, [getFeedbacks, user, token]);
  return (
    <FeedbackContext.Provider value={{ feedbacks, getFeedbacks, addFeedback, updateFeedback, getFeedback, feedback}}>
      {children}
    </FeedbackContext.Provider>
  );
};

export interface FeedbackContextProps {
  feedbacks: Feedback[];
  getFeedbacks: () => void;
  addFeedback: (feedback: FeedbackAdd) => void;
  updateFeedback: (feedback: FeedbackAdd) => void;
  getFeedback: (studentId: string) => Promise<FeedbackAdd | undefined>;
  feedback: FeedbackAdd | null;
}

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
