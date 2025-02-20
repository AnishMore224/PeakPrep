import React, { useEffect, useState } from "react";
import {
  Users,
  Trophy,
  MessageSquare,
  TrendingUp, 
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUIContext } from "../../contexts/ui.context";
import { useStudent } from "../../contexts/student.context";  // Add this import
import { useCompany } from "../../contexts/company.context";  // Add this import
import { useHr } from "../../contexts/hr.context";  // Add this import

interface StatData {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
}

interface Contest {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: "upcoming" | "active" | "completed";
}

interface Feedback {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    regd_no: string;
  }[];
  companyName: string;
  type: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// const UserCount: React.FC = () => {
//   const [userCount, setUserCount] = useState<number>(0);
//   const BASE_URL = "http://localhost:3030/api/user";

//   useEffect(() => {
//     const fetchUserCount = async () => {
//       try {
//         const response = await fetch($"{BASE_URL}/");
//         const data = await response.json();
//         setUserCount(data.count);
//       } catch (error) {
//         console.error("Failed to fetch user count:", error);
//       }
//     };

//     fetchUserCount();
//   }, []);

//   return <div>User Count: {userCount}</div>;
// };

const AdminDashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTab, setSelectedTab] = useState("group");
  const { isSidebarVisible } = useUIContext();
  const { students } = useStudent();  // Add this line to get students data
  const { companies } = useCompany();  // Add this line to get companies data
  const { hrmembers } = useHr();  // Add this line to get HR data
  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchRecentFeedback = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3030/api/feedback/recent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setRecentFeedback(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch recent feedback:", error);
      }
    };

    fetchRecentFeedback();
  }, []);

  const stats: StatData[] = [
    {
      title: "Total Students",
      value: students.length.toString(), 
      icon: Users,
    },
    {
      title: "Total Companies",
      value: companies.length.toString(),
      icon: Trophy,
    },
    {
      title: "Total HR",
      value: hrmembers.length.toString(),
      icon: MessageSquare,
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      icon: TrendingUp,
    },
  ];

  const contests: Contest[] = [
    {
      id: "1",
      title: "Web Development Challenge",
      startDate: "2024-03-01",
      endDate: "2024-03-15",
      participants: 156,
      status: "active",
    },
    {
      id: "2",
      title: "UI/UX Design Sprint",
      startDate: "2024-03-20",
      endDate: "2024-04-05",
      participants: 89,
      status: "upcoming",
    },
  ];

// Remove or comment out this static data
// const feedback: Feedback[] = [ ... ];

  const renderStatCard = ({ title, value, icon: Icon, trend }: StatData, index: number) => (
    <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900 mt-1">{value}</h3>
          {trend && (
            <p
              className={`text-sm mt-1 ${
                trend.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`flex-1 bg-gray-50 transition-all duration-300 ${
        isSidebarVisible ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
      }`}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Dashboard Overview
          </h2>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => renderStatCard(stat, index))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contests Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Active Contests
                </h2>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Contests</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="space-y-4">
                {contests.map((contest) => (
                  <div
                    key={contest.id}
                    className="p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">
                        {contest.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          contest.status === "active"
                            ? "bg-green-100 text-green-800"
                            : contest.status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {contest.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Participants: {contest.participants}</p>
                      <p>
                        Duration: {contest.startDate} - {contest.endDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Feedback
                </h2>
              </div>
              <div className="space-y-4">
                {recentFeedback.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {item.companyName}
                        </h3>
                        <p className="text-sm text-gray-600">{item.type}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.comment}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>For {item.studentId.map(s => s.name).join(', ')}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
