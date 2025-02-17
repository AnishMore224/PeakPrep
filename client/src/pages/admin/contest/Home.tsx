import { useState } from "react";
import { BookOpen, Code, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContestCard from "../../../components/admin/contest/ContestCard";
import DeleteConfirmation from "../../../components/admin/contest/DeleteConfirmation";
import { useContest } from "../../../contexts/contest.context";
import { DailyContestType, CodingContestType } from "../../../types/index";
import { useUIContext } from "../../../contexts/ui.context";
import Layout from "../../../components/student/contest/Layout";

const Home = () => {
    const { dailyContests, codingContests, deleteContest } = useContest();
    const { isSidebarVisible } = useUIContext();
    const [activeTab, setActiveTab] = useState<"daily" | "coding">("daily");
    const [contestToDelete, setContestToDelete] = useState<
        DailyContestType | CodingContestType | null
    >(null);
    const [contests, setContests] = useState({
        daily: dailyContests,
        coding: codingContests,
    });
    const navigate = useNavigate();

    const handleEdit = (contest: DailyContestType | CodingContestType) => {
        console.log("Edit contest:", contest);
        // Implement edit functionality
    };

    const handleDelete = (contest: DailyContestType | CodingContestType) => {
        setContestToDelete(contest);
    };

    const confirmDelete = async () => {
        if (contestToDelete) {
            const contestType = activeTab === "daily" ? "DailyContest" : "CodingContest";
            try {
                await deleteContest(contestToDelete._id, contestType);
            } catch (error) {
                console.error("Failed to delete contest:", error);
            }
            setContestToDelete(null);
        }
    };

    const handleCreateContest = () => {
        navigate("/contest/create");
    };

    const now = new Date();

    const filterContests = (
        contests: (DailyContestType | CodingContestType)[]
    ) => {
        const ongoing = contests.filter(
            (contest) =>
                new Date(contest.startTime) <= now && new Date(contest.endTime) >= now
        );
        const upcoming = contests.filter(
            (contest) => new Date(contest.startTime) > now
        );
        const past = contests.filter((contest) => new Date(contest.endTime) < now);
        return { ongoing, upcoming, past };
    };

    const { ongoing, upcoming, past } = filterContests(
        activeTab === "daily" ? contests.daily : contests.coding
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-1 rounded-xl bg-blue-100 p-1">
                        <button
                            className={`flex items-center px-4 py-2 mx-4 rounded-lg ${
                                activeTab === "daily"
                                    ? "bg-white text-blue-700 shadow"
                                    : "text-blue-600 hover:bg-white/60"
                            } transition-colors duration-150`}
                            onClick={() => setActiveTab("daily")}
                        >
                            <BookOpen className="w-5 h-5 mr-2" />
                            Daily Contests
                        </button>
                        <button
                            className={`flex items-center px-4 py-2 mx-4 rounded-lg ${
                                activeTab === "coding"
                                    ? "bg-white text-blue-700 shadow"
                                    : "text-blue-600 hover:bg-white/60"
                            } transition-colors duration-150`}
                            onClick={() => setActiveTab("coding")}
                        >
                            <Code className="w-5 h-5 mr-2" />
                            Coding Contests
                        </button>
                    </div>
                    <button
                        className="flex items-center px-4 py-2 rounded-lg bg-green-500 text-white shadow transition-colors duration-150 hover:bg-green-600 cursor-pointer"
                        onClick={handleCreateContest}
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Create Contest
                    </button>
                </div>

                {/* Ongoing Contests */}
                {ongoing.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Ongoing Contests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ongoing.map((contest, index) => (
                                <ContestCard
                                    key={index}
                                    contest={contest}
                                    type={activeTab}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {ongoing.length > 0 && <hr className="my-8" />}

                {/* Upcoming Contests */}
                {upcoming.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Upcoming Contests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcoming.map((contest, index) => (
                                <ContestCard
                                    key={index}
                                    contest={contest}
                                    type={activeTab}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {upcoming.length > 0 && <hr className="my-8" />}

                {/* Past Contests */}
                {past.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Past Contests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {past.map((contest, index) => (
                                <ContestCard
                                    key={index}
                                    contest={contest}
                                    type={activeTab}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
                isOpen={!!contestToDelete}
                contestName={contestToDelete?.title || ""}
                onClose={() => setContestToDelete(null)}
                onConfirm={confirmDelete}
            />
        </Layout>
    );
};

export default Home;
