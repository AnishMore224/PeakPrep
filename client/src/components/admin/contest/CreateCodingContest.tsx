import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useContest } from "../../../contexts/contest.context";

interface CodingQuestion {
  title: string;
  description: string;
  inputInstructions: string;
  outputInstructions: string;
  example: {
    input: string;
    output: string;
    explanation: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

export const CodingContestForm = () => {
  const [title, setTitle] = useState("Coding Contest 0");
  const [description, setDescription] = useState("test contest");
  const [startTime, setStartTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [endTime, setEndTime] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [rules, setRules] = useState("No Rules !");
  const [questions, setQuestions] = useState<CodingQuestion[]>([
    {
      title: "Question 1",
      description: "Write a function that adds two numbers",
      inputInstructions: "Input: Two integers",
      outputInstructions: "Output: An integer",
      example: {
        input: "1, 2",
        output: "3",
        explanation: "1 + 2 = 3",
      },
      testCases: [
        {
          input: "1, 2",
          expectedOutput: "3",
        },
        {
          input: "5, 5",
          expectedOutput: "10",
        },
      ],
    },
  ]);

  const { createContest } = useContest();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        description: "",
        inputInstructions: "",
        outputInstructions: "",
        example: {
          input: "",
          output: "",
          explanation: "",
        },
        testCases: [],
      },
    ]);
  };

  const addTestCase = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].testCases.push({
      input: "",
      expectedOutput: "",
    });
    setQuestions(newQuestions);
  };

  const updateQuestion = (
    index: number,
    field: keyof CodingQuestion,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateExample = (
    questionIndex: number,
    field: keyof CodingQuestion["example"],
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].example = {
      ...newQuestions[questionIndex].example,
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  const updateTestCase = (
    questionIndex: number,
    testCaseIndex: number,
    field: keyof CodingQuestion["testCases"][0],
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].testCases[testCaseIndex] = {
      ...newQuestions[questionIndex].testCases[testCaseIndex],
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const removeTestCase = (questionIndex: number, testCaseIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].testCases.splice(testCaseIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contestData = {
      title,
      description,
      startTime,
      endTime,
      rules,
      questions,
      type: "CodingContest",
    };
    await createContest(contestData);
    window.location.href = "/contest";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <div>
            <label className="block mb-1">Start Time:</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1">End Time:</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full  p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
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
          <div key={qIndex} className="p-4 border border-blue-100 rounded">
            <div className="flex justify-between items-start mb-2">
              <input
                type="text"
                placeholder="Question Title"
                value={question.title}
                onChange={(e) =>
                  updateQuestion(qIndex, "title", e.target.value)
                }
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

            <textarea
              placeholder="Question Description"
              value={question.description}
              onChange={(e) =>
                updateQuestion(qIndex, "description", e.target.value)
              }
              className="w-full p-2 mt-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
            />

            <div className="grid grid-cols-2 gap-4 mt-2">
              <textarea
                placeholder="Input Instructions"
                value={question.inputInstructions}
                onChange={(e) =>
                  updateQuestion(qIndex, "inputInstructions", e.target.value)
                }
                className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              />
              <textarea
                placeholder="Output Instructions"
                value={question.outputInstructions}
                onChange={(e) =>
                  updateQuestion(qIndex, "outputInstructions", e.target.value)
                }
                className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h4 className="font-medium mb-2">Example</h4>
              <div className="space-y-2">
                <textarea
                  placeholder="Input"
                  value={question.example.input}
                  onChange={(e) =>
                    updateExample(qIndex, "input", e.target.value)
                  }
                  className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                />
                <textarea
                  placeholder="Output"
                  value={question.example.output}
                  onChange={(e) =>
                    updateExample(qIndex, "output", e.target.value)
                  }
                  className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                />
                <textarea
                  placeholder="Explanation"
                  value={question.example.explanation}
                  onChange={(e) =>
                    updateExample(qIndex, "explanation", e.target.value)
                  }
                  className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Test Cases</h4>
              {question.testCases.map((testCase, tIndex) => (
                <div
                  key={tIndex}
                  className="p-4 bg-white border border-blue-100 rounded mb-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <textarea
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(e) =>
                          updateTestCase(
                            qIndex,
                            tIndex,
                            "input",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                      />
                      <textarea
                        placeholder="Expected Output"
                        value={testCase.expectedOutput}
                        onChange={(e) =>
                          updateTestCase(
                            qIndex,
                            tIndex,
                            "expectedOutput",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTestCase(qIndex, tIndex)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addTestCase(qIndex)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <PlusCircle size={16} className="mr-1" /> Add Test Case
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
        Create Coding Contest
      </button>
    </form>
  );
};
