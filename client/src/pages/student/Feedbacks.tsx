import { useState, useEffect } from "react";
import { useFeedback } from "../../contexts/feedback.context";
import { Star, X, Search } from "lucide-react";
import { useUIContext } from "../../contexts/ui.context";
import SortButton from "../../components/student/SortButton";

export interface Feedback {
  companyName: string;
  type: string;
  comment: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

type SortField = "companyName" | "type" | "rating" | "createdAt";
type SortOrder = "asc" | "desc";

function Feedbacks() {
  const { feedbacks } = useFeedback();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>(feedbacks);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortFeedback = (feedback: Feedback[]) => {
    return [...feedback].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "companyName":
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  useEffect(() => {
    const filtered = feedbacks.filter(
      (card) =>
        card.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(card.createdAt)
          .toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredFeedback(sortFeedback(filtered));
  }, [feedbacks, searchTerm, sortField, sortOrder]);

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const { isSidebarVisible } = useUIContext();

  return (
    <>
      <div
        className={`flex-1 py-6 px-3 md:p-8 transition-all duration-300 ${
          isSidebarVisible ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
        }`}
      >
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Sort Button */}
            <SortButton
              sortOrder={sortOrder}
              sortField={sortField}
              setSortField={setSortField}
              handleSort={handleSort}
            />

            {/* Action Buttons */}
            
          </div>
        </div>

        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredFeedback.map((card, index) => (
            <div
              key={index}
              className="shadow-lg rounded-xl p-6 bg-white bg-opacity-90 transition-all transform hover:scale-[1.05] hover:shadow-2xl hover:bg-opacity-100 border border-gray-200 cursor-pointer h-[280px] flex flex-col"
              onClick={() => setSelectedFeedback(card)}
            >
              <h2 className="text-2xl font-bold text-primary mb-3">
                {card.companyName}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                <span className="font-semibold">Type:</span> {card.type}
              </p>
              <p className="text-gray-700 text-sm mb-4 flex-grow">
                <span className="font-semibold">Feedback:</span>{" "}
                "{truncateText(card.comment, 140)}"
              </p>

              <div className="text-gray-600 text-sm space-y-2">
                <p className="flex items-center font-semibold text-lg">
                  Rating:{" "}
                  <span className="ml-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={22}
                        className={`${
                          card.rating > i
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        } transition-all duration-300`}
                      />
                    ))}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(card.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full relative animate-fadeIn">
            <button
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">
                {selectedFeedback.companyName}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Type</h3>
                  <p className="text-gray-600">{selectedFeedback.type}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Feedback</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    "{selectedFeedback.comment}"
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Rating</h3>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={28}
                        className={`${
                          selectedFeedback.rating > i
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        } transition-all duration-300`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Date</h3>
                  <p className="text-gray-600">
                    {new Date(selectedFeedback.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Feedbacks;