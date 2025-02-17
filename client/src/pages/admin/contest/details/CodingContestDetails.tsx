import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart3, List, Trophy, Settings } from "lucide-react";
import TabButton from '../../../../components/admin/contest/details/TabButton';
import OverviewTab from '../../../../components/admin/contest/details/OverviewTab';
import QuestionsTab from '../../../../components/admin/contest/details/CodingContest/QuestionsTab';
import RankingsTab from '../../../../components/admin/contest/details/RankingsTab';
import SettingsTab from '../../../../components/admin/contest/details/CodingContest/SettingsTab';
import { useContest } from '../../../../contexts/contest.context';
import LoadingScreen from '../../../LoadingScreen';
import { useUIContext } from '../../../../contexts/ui.context';
import { CodingContestType } from '../../../../types';

type TabType = "overview" | "questions" | "rankings" | "settings";

const CodingContestDetails = () => {
    const { id } = useParams<{ id: string }>() || {};
    const contestId = id;
    const { getContest, error } = useContest();
    const [contest, setContest] = useState<CodingContestType | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const { isSidebarVisible } = useUIContext();

    useEffect(() => {
        if (!contestId) {
            console.error("Error: Contest ID is required");
            return;
        }

        const fetchContest = async () => {
            const fetchedContest = await getContest(contestId, "CodingContest");
            setContest(fetchedContest);
        };

        fetchContest();
    }, [contestId, getContest]);

    useEffect(() => {
        if (contest) {
            const timer = setInterval(() => {
                const now = new Date();
                const end = new Date(contest.endTime);
                const diff = end.getTime() - now.getTime();

                if (diff <= 0) {
                    setTimeLeft("Contest Ended");
                    clearInterval(timer);
                } else {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [contest]);

    const isContestActive =
        contest &&
        new Date() >= new Date(contest.startTime) &&
        new Date() <= new Date(contest.endTime);

    const handleSettingsChange = (field: keyof CodingContestType, value: any) => {
        if (contest) {
            setContest((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    [field]: value,
                };
            });
        }
    };

    if (error) {
        return <div className="m-10 text-red-500">Error: {error}</div>;
    }

    if (!contest) {
        return <LoadingScreen />;
    }

    return (
        <div
            className={`flex-1 bg-gray-50 transition-all duration-300 ${
                isSidebarVisible ? "md:ml-64" : "md:ml-20"
            }`}
        >
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Contest Header */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">{contest.title}</h1>
                                    {contest.description && (
                                        <p className="mt-2 text-blue-100">{contest.description}</p>
                                    )}
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <button
                                        className={`px-5 py-2 rounded-lg font-semibold transition duration-300 ${
                                            isContestActive
                                                ? "bg-green-500 hover:bg-green-600 text-white"
                                                : "bg-gray-200 text-gray-600 cursor-not-allowed"
                                        }`}
                                        disabled={!isContestActive}
                                    >
                                        {isContestActive ? "Active" : "Inactive"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="mb-6 border-b border-gray-200">
                        <div className="flex space-x-4 px-2 sm:px-0">
                            <TabButton
                                tab="overview"
                                icon={<BarChart3 className="w-5 h-5" />}
                                label="Overview"
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                            <TabButton
                                tab="questions"
                                icon={<List className="w-5 h-5" />}
                                label="Questions"
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                            <TabButton
                                tab="rankings"
                                icon={<Trophy className="w-5 h-5" />}
                                label="Rankings"
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                            <TabButton
                                tab="settings"
                                icon={<Settings className="w-5 h-5" />}
                                label="Settings"
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </div>
                    </div>

                    {/* Tabs Content */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        {activeTab === "overview" && (
                            <OverviewTab contest={contest} timeLeft={timeLeft} />
                        )}
                        {activeTab === "questions" && <QuestionsTab contest={contest} />}
                        {activeTab === "rankings" && <RankingsTab contest={contest} />}
                        {activeTab === "settings" && (
                            <SettingsTab contest={contest} handleSettingsChange={handleSettingsChange} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingContestDetails;