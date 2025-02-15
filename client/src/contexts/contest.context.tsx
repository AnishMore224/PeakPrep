import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DailyContestType, CodingContestType } from "../types";
import { deleteRequest, getRequest, postRequest } from "../utils/services";
import { useAuth } from "./auth.context";

interface ContestContextProps {
    dailyContests: DailyContestType[];
    codingContests: CodingContestType[];
    getDailyContests: () => Promise<void>;
    getCodingContests: () => Promise<void>;
    error: string | null;
    updateError: (message: string | null) => void;
    createContest: (contestData: any) => Promise<void>;
    deleteContest: (contestId: string, type: string) => Promise<void>;
}

const BASE_URL = "http://localhost:3030/api/contest";

const ContestContext = createContext<ContestContextProps | undefined>(undefined);

export const ContestProvider = ({ children }: { children: React.ReactNode }) => {
    const [dailyContests, setDailyContests] = useState<DailyContestType[]>([]);
    const [codingContests, setCodingContests] = useState<CodingContestType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const { jwtToken } = useAuth();

    const getDailyContests = useCallback(async () => {
        try {
            const response = await getRequest(`${BASE_URL}/dailycontests`);
            if (response?.data?.contests) {
                setDailyContests(response.data.contests);
            } else {
                setError(response?.error || "Failed to fetch daily contests");
            }
        } catch {
            setError("Failed to fetch daily contests");
        }
    }, []);

    const getCodingContests = useCallback(async () => {
        try {
            const response = await getRequest(`${BASE_URL}/codingcontests`);
            if (response?.data?.contests) {
                setCodingContests(response.data.contests);
            } else {
                setError(response?.error || "Failed to fetch coding contests");
            }
        } catch {
            setError("Failed to fetch coding contests");
        }
    }, []);

    const createContest = useCallback(async (contestData: any) => {
        try {
            const response = await postRequest(
                `${BASE_URL}/create`,
                JSON.stringify(contestData),
                jwtToken
            );
            if (response?.ok) {
                window.location.href = "/contest";
            } else {
                setError(response?.error || "Failed to create contest");
            }
        } catch {
            setError("Failed to create contest");
        }
    }, [jwtToken]);

    const deleteContest = useCallback(async (contestId: string, type: string) => {
        try {
            const response = await deleteRequest(
                `${BASE_URL}/delete`,
                JSON.stringify({ contestId, type }),
                jwtToken
            );
            if (response?.success) {
                await getDailyContests();
                await getCodingContests();
            } else {
                setError(response?.error || "Failed to delete contest");
            }
        } catch {
            setError("Failed to delete contest");
        }
    }, [jwtToken, getDailyContests, getCodingContests]);

    const updateError = useCallback((message: string | null) => {
        setError(message);
    }, []);

    useEffect(() => {
        getDailyContests();
        getCodingContests();
    }, [getDailyContests, getCodingContests]);

    return (
        <ContestContext.Provider value={{
            dailyContests,
            codingContests,
            error,
            updateError,
            getDailyContests,
            getCodingContests,
            createContest,
            deleteContest,
        }}>
            {children}
        </ContestContext.Provider>
    );
};

export const useContest = () => {
    const context = useContext(ContestContext);
    if (!context) {
        throw new Error("useContest must be used within a ContestProvider");
    }
    return context;
};
