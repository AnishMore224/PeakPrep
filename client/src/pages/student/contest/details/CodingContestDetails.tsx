import React, { useEffect, useState } from 'react';
import { Clock, Users, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { CodingContestType } from '../../../../types';
import { useContest } from '../../../../contexts/contest.context';
import LoadingScreen from '../../../LoadingScreen';
import { useParams } from 'react-router-dom';

const CodingContestDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const contestId = id;
    const { getContest, error } = useContest();
    const [contest, setContest] = useState<CodingContestType | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        const fetchContestDetails = async () => {
            const data = await getContest(contestId, 'CodingContest');
            setContest(data);
        };

        fetchContestDetails();
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

    if (error) {
        return <div className="m-10 text-red-500">Error: {error}</div>;
    }

    if (!contest) {
        return <LoadingScreen />;
    }

    const isContestActive = new Date() >= new Date(contest.startTime) && new Date() <= new Date(contest.endTime);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
                        <p className="text-blue-100">{contest.description}</p>
                    </div>

                    {/* Contest Info */}
                    <div className="p-6 space-y-6">
                        {/* Time Section */}
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-gray-600">Time Remaining:</span>
                            </div>
                            <span className="text-lg font-semibold text-blue-600">{timeLeft}</span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Participants</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{contest.participants.length}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Questions</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{contest.questions.length}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Completed</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {contest.participants.filter(p => p.status === "Completed").length}
                                </p>
                            </div>
                        </div>

                        {/* Rules Section */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center space-x-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-semibold">Contest Rules</h2>
                            </div>
                            <div className="space-y-2">
                                {contest.rules?.split('\n').map((rule, index) => (
                                    <p key={index} className="text-gray-600">{rule}</p>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center">
                            <button 
                                className={`px-8 py-3 rounded-lg font-semibold text-white transition duration-300 ${
                                    isContestActive 
                                        ? 'bg-blue-600 hover:bg-blue-700' 
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                                disabled={!isContestActive}
                                onClick={() => alert(isContestActive ? "Starting contest..." : "Contest is not active")}
                            >
                                {isContestActive ? "Start Contest" : "Contest Not Active"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingContestDetails;
