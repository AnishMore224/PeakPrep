import { useState } from "react";
import { SearchBar } from "../../components/student/open-source/SearchBar";
import { DifficultyFilter } from "../../components/student/open-source/DifficultyFilter";
import { RepositoryList } from "../../components/student/open-source/RepositoryList";
import { Repository, Difficulty } from "../../types/index";
import axios from "axios";
import { useUIContext } from "../../contexts/ui.context";
const GITHUB_ACCESS_TOKEN = import.meta.env.VITE_GITHUB_ACCESS_TOKEN as string;

axios.defaults.headers.common["Authorization"] = `token ${GITHUB_ACCESS_TOKEN}`;

function OpenSource() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "">(
    ""
  );
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const { isSidebarVisible } = useUIContext();

  const fetchRepositories = async () => {
    if (searchTerm.length <= 2) {
      setError("Search term must be longer than 2 characters.");
      return;
    }

    setLoading(true);
    setRepositories([]);
    setSearched(true);
    setError("");
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories`,
        {
          params: {
            q: searchTerm,
            sort: "stars",
            order: "desc",
          },
        }
      );

      const nonAppTopics = ["cheatsheet", "roadmap", "awesome-list", "tutorial"];

      const repos = await Promise.all(
        response.data.items.map(async (repo: any) => {
          const repoDetails = await axios.get(repo.url);
          const issues = await axios.get(`${repo.url}/issues`, {
            params: { state: "open" },
          });

          const size = repoDetails.data.size;
          const topics = repo.topics || [];
          let difficulty: Difficulty = "unknown";

          if (size < 1000 && issues.data.length < 10) {
            difficulty = "beginner";
          } else if (size >= 1000 && size < 5000 && issues.data.length < 20) {
            difficulty = "intermediate";
          } else if (size >= 5000 || issues.data.length >= 20) {
            difficulty = "advanced";
          }

            const isNonApp: boolean = topics.some((topic: string) => nonAppTopics.includes(topic));

          if (isNonApp) {
            return null;
          }

          return {
            id: repo.id,
            title: repo.name,
            description: repo.description,
            tags: topics,
            difficulty: difficulty,
            stars: repo.stargazers_count,
            html_url: repo.html_url,
          };
        })
      );

      setRepositories(repos.filter(repo => repo !== null));
    } catch (error) {
      setError(`Failed to fetch repositories. Please try again later.\n${error}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = repositories.filter((repo) => {
    const matchesDifficulty =
      !selectedDifficulty || repo.difficulty === selectedDifficulty;
    return matchesDifficulty;
  });

  return (
    <div
      className={`flex-1 transition-all duration-300 min-h-screen bg-gradient-to-b from-gray-50 to-white ${
        isSidebarVisible ? "md:ml-64" : "md:ml-20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Find Your Next Project
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover repositories that match your skills and interests
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8 space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <div className="mt-4">
              <DifficultyFilter
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
              />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={fetchRepositories}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading repositories...</p>
          ) : (
            repositories.length == 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No repositories found matching your criteria.
                </p>
              </div>
            )
          )}
          {error && <p className="text-center text-red-500">{error}</p>}

          <RepositoryList repositories={filteredRepos} searched={searched} />

          {/* Pagination Component */}
        </div>
      </div>
    </div>
  );
}

export default OpenSource;