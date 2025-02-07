import React, { useState } from "react";
import {
  Search,
  Download,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Star,
  Building,
  Calendar,
  FileSpreadsheet,
  GraduationCap,
} from "lucide-react";

// Mock data type
interface Student {
  id: string;
  name: string;
  resumeScore: number;
  skills: string[];
  placementStatus: "Placed" | "In Progress" | "Not Started";
  companyPlaced?: string;
  placementDate?: string;
  feedback?: string;
}

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Student 1",
    resumeScore: 92,
    skills: ["React", "TypeScript", "Node.js"],
    placementStatus: "Placed",
    companyPlaced: "TechCorp",
    placementDate: "2024-02-15",
    feedback: "Excellent problem-solving skills and technical knowledge.",
  },
  {
    id: "2",
    name: "Student 2",
    resumeScore: 88,
    skills: ["Python", "Data Science", "SQL"],
    placementStatus: "Placed",
    companyPlaced: "DataSolutions",
    placementDate: "2024-02-10",
    feedback: "Strong analytical capabilities and great team player.",
  },
  {
    id: "3",
    name: "Student 3",
    resumeScore: 85,
    skills: ["Java", "Spring Boot", "AWS"],
    placementStatus: "In Progress",
    feedback: "Currently interviewing with multiple companies.",
  },
];

export function AdminPanel() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: "asc" | "desc";
  } | null>(null);
  const [filters, setFilters] = useState({
    minResumeScore: 0,
    placementStatus: "all",
    skill: "",
  });

  const sortData = (key: keyof Student) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.companyPlaced &&
          student.companyPlaced
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const matchesScore = student.resumeScore >= filters.minResumeScore;
      const matchesStatus =
        filters.placementStatus === "all" ||
        student.placementStatus === filters.placementStatus;
      const matchesSkill =
        !filters.skill ||
        student.skills.some((skill) =>
          skill.toLowerCase().includes(filters.skill.toLowerCase())
        );
      return matchesSearch && matchesScore && matchesStatus && matchesSkill;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Resume Score",
      "Skills",
      "Status",
      "Company",
      "Date",
      "Feedback",
    ];
    const csvData = filteredStudents.map((student) => [
      student.name,
      student.resumeScore,
      student.skills.join(", "),
      student.placementStatus,
      student.companyPlaced || "",
      student.placementDate || "",
      student.feedback || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_placements.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Student Placement Dashboard
            </h1>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export to CSV
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or company..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.placementStatus}
                onChange={(e) =>
                  setFilters({ ...filters, placementStatus: e.target.value })
                }
              >
                <option value="all">All Statuses</option>
                <option value="Placed">Placed</option>
                <option value="In Progress">In Progress</option>
                <option value="Not Started">Not Started</option>
              </select>

              <input
                type="number"
                placeholder="Min Resume Score"
                className="border rounded-lg px-4 py-2 w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.minResumeScore}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minResumeScore: parseInt(e.target.value) || 0,
                  })
                }
              />

              <input
                type="text"
                placeholder="Filter by skill..."
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.skill}
                onChange={(e) =>
                  setFilters({ ...filters, skill: e.target.value })
                }
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => sortData("name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {sortConfig?.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => sortData("resumeScore")}
                  >
                    <div className="flex items-center gap-2">
                      Resume Score
                      {sortConfig?.key === "resumeScore" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => sortData("placementStatus")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortConfig?.key === "placementStatus" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{student.resumeScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {student.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          student.placementStatus === "Placed"
                            ? "bg-green-100 text-green-800"
                            : student.placementStatus === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {student.placementStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.companyPlaced && (
                        <div>
                          <div className="flex items-center text-gray-900">
                            <Building className="h-4 w-4 mr-1" />
                            {student.companyPlaced}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(
                              student.placementDate!
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs">
                        {student.feedback}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
