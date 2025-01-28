import React, { useState } from "react";
import { GraduationCap, Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange(star)}
          className="focus:outline-none"
        >
          <Star
            size={24}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

const FeedbackForm: React.FC = () => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [students, setStudents] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log({
      company,
      role,
      feedback,
      students: students.split(","),
      date,
      rating,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:ml-64 ml-0">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 shadow rounded-lg"
      >
        <h1 className="text-2xl font-semibold mb-4">Submit Feedback</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Students (comma separated)
          </label>
          <input
            type="text"
            value={students}
            onChange={(e) => setStudents(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Rating</label>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
