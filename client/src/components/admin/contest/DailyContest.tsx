import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { postRequest } from "../../../utils/services";
import { useAuth } from "../../../contexts/auth.context";
import Error from "../../error";

interface Question {
  questionText: string;
  options: string[];
}

export const DailyContestForm = () => {
  //   const [title, setTitle] = useState('');
  //   const [description, setDescription] = useState('');
  //   const [startTime, setStartTime] = useState('');
  //   const [endTime, setEndTime] = useState('');
  //   const [rules, setRules] = useState('');
  //   const [questions, setQuestions] = useState<Question[]>([]);
  
  // dummy data
  const [title, setTitle] = useState("Daily Contest 0");
  const [description, setDescription] = useState("test contest");
  const [startTime, setStartTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [rules, setRules] = useState("No Rules !");
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "Who's who?",
      options: ["1", "2", "3", "4"],
    }
  ]);
  const { jwtToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const URL = "http://localhost:3030/api/contest/create";

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: [] },
    ]);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
  };

  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = text;
    setQuestions(newQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    const response = await postRequest(
        URL,
        JSON.stringify({
            title,
            description,
            startTime,
            endTime,
            rules,
            questions: questions,
            type: "DailyContest",
        }),
        jwtToken
    );
    if (response.ok) {
        window.location.href = "/contest";
    } else {
        setError(response.error);
        console.log(error)
    }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-500">
          <Error message={error} onClose={() => {
            window.location.href = "/contest";
            setError(null)
          }} />
        </div>
      )}
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Contest Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <textarea
          placeholder="Contest Rules"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="p-4 border border-blue-100 rounded"
          >
            <div className="flex justify-between items-start mb-2">
              <input
                type="text"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                className="flex-1 p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-2 ml-4">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center">
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, e.target.value)
                    }
                    className="flex-1 p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(qIndex, oIndex)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <PlusCircle size={16} className="mr-1" /> Add Option
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <PlusCircle size={20} className="mr-2" /> Add Question
        </button>
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Daily Contest
      </button>
    </form>
  );
};
