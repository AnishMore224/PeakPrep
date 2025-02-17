import { useState, useEffect } from "react";
import { BookOpen, Code } from "lucide-react";
import ContestCard from "../../../components/student/contest/ContestCard";
import { useContest } from "../../../contexts/contest.context";
import { DailyContestType, CodingContestType } from "../../../types/index";
import Layout from "../../../components/student/contest/Layout";

const Home = () => {
  const { dailyContests, codingContests, getDailyContests, getCodingContests } = useContest();
  const [activeTab, setActiveTab] = useState<"daily" | "coding">("daily");
  const [contests, setContests] = useState({
    daily: dailyContests,
    coding: codingContests,
  });

  useEffect(() => {
    getDailyContests();
    getCodingContests();
  }, [getDailyContests, getCodingContests]);

  useEffect(() => {
    setContests({
      daily: dailyContests,
      coding: codingContests,
    });
  }, [dailyContests, codingContests]);

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
        </div>

        {/* Ongoing Contests */}
        {ongoing.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Ongoing Contests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoing.map((contest, index) => (
                <ContestCard key={index} contest={contest} type={activeTab} />
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
                <ContestCard key={index} contest={contest} type={activeTab} />
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
                <ContestCard key={index} contest={contest} type={activeTab} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Home;