import { useEffect, useState } from "react";
import axios from "axios";
import { contestQuestions, InitialCode } from "./questions";

import {
  Clock,
  Settings,
  Code2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import Editor from "../../../components/student/contest/Editor";
import { Description } from "../../../components/student/contest/Description";
import EditorHeader from "../../../components/student/contest/EditorHeader";

interface TestCase {
  id: number;
  input: string;
  output: string;
}

function CodeEditor() {
  const [theme, setTheme] = useState<
    | "vscodeDark"
    | "githubDark"
    | "githubLight"
    | "bespin"
    | "duotoneDark"
    | "duotoneLight"
    | "dracula"
    | "xcodeDark"
    | "xcodeLight"
    | "okaidia"
  >("vscodeDark");
  const [code, setCode] = useState(InitialCode.java);
  const [questions, setQuestions] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState("30:00");
  const [activeTab, setActiveTab] = useState("description");
  const [isRunning, setIsRunning] = useState(false);
  const [languageName, setLanguageName] = useState<
    "java" | "cpp" | "javascript" | "python"
  >("java");
  const [activeTestCase, setActiveTestCase] = useState(1);
  const [submissionResults, setSubmissionResults] = useState<
    { id: number; input: string; output: string; error: string | null }[]
  >([]);

  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 1, input: "[[1,7,3],[9,8,2],[4,5,6]]", output: "" },
  ]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const handleInputChange = (id: number, value: string) => {
    setTestCases((prevCases: TestCase[]) =>
      prevCases.map((c: TestCase) => (c.id === id ? { ...c, input: value } : c))
    );
  };

  useEffect(() => {
    const shuffledQuestions = contestQuestions.sort(() => 0.5 - Math.random());
    setQuestions(shuffledQuestions.slice(0, 2));
  }, []);

  const handleRunCode = async () => {
    setIsRunning(true);
    const currentCase = testCases.find((c) => c.id === activeTestCase);
    if (!currentCase) return;
    const apiKey = import.meta.env.VITE_RAPID_API_KEY as string; // Replace with your RapidAPI Key

    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: {
        base64_encoded: "true",
        wait: "true",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        language_id: 62,
        source_code: btoa(code),
        stdin: "",
      },
    };
    try {
      const response = await axios.request(options);
      const result = response.data;
      const output = result.stdout ? atob(result.stdout) : null;
      const error = result.stderr ? atob(result.stderr) : null;

      setTestCases((cases) =>
        cases.map((c) =>
          c.id === activeTestCase
            ? { ...c, output: output || `Error: ${error}` }
            : c
        )
      );
    } catch (error) {
      console.error("Execution error:", error);
    }
    setIsRunning(false);
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    const currentCase = testCases.find((c) => c.id === activeTestCase);
    if (!currentCase) return;
    const apiKey = import.meta.env.VITE_RAPID_API_KEY as string; // Replace with your RapidAPI Key
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: {
        base64_encoded: "true",
        wait: "true",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        language_id: 62,
        source_code: btoa(code),
        stdin: "",
      },
    };

    try {
      const response = await axios.request(options);
      const result = response.data;
      const output = result.stdout ? atob(result.stdout) : null;
      const error = result.stderr ? atob(result.stderr) : null;

      setTestCases((cases) =>
        cases.map((c) =>
          c.id === activeTestCase
            ? { ...c, output: output || `Error: ${error}` }
            : c
        )
      );

      setSubmissionResults((prevResults) => [
        ...prevResults,
        {
          id: activeTestCase,
          input: currentCase.input,
          output: output || "",
          error: error,
        },
      ]);
    } catch (error) {
      console.error("Execution error:", error);
    }
    setIsRunning(false);
  };

  const currentTestCase =
    testCases.find((c) => c.id === activeTestCase) || null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col overflow-hidden ">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Code2 className="w-6 h-6 text-blue-400" />
            <div className="flex items-center space-x-2 text-gray-400">
              <ChevronLeft className="w-4 h-4" />
              <span>Weekly Contest 436</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-md">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="font-mono">{timeLeft}</span>
            </div>
            <button className="p-2 hover:bg-gray-700 rounded-md">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Panel - Problem Description */}
        <div className="w-[45%] border-r border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 px-4">
            <button
              className={`px-4 py-3 flex items-center space-x-2 border-b-2 ${
                activeTab === "description"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("description")}
            >
              <BookOpen className="w-4 h-4" />
              <span>Description</span>
            </button>

            <button
              className={`px-4 py-3 flex items-center space-x-2 border-b-2 ${
                activeTab === "submissions"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Submissions</span>
            </button>
          </div>

          {activeTab === "submissions" && (
            <div className="p-4 overflow-y-auto">
              <h2 className="text-lg font-bold text-white mb-4">
                Submission Results
              </h2>
              {submissionResults.length === 0 ? (
                <p className="text-gray-400">No submissions yet.</p>
              ) : (
                submissionResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 bg-gray-800 rounded-md mb-4 border border-gray-700"
                  >
                    <h3 className="text-blue-400 font-semibold mb-2">
                      Test Case {result.id}
                    </h3>
                    <div className="mb-2">
                      <span className="text-gray-400">Input:</span>
                      <pre className="bg-gray-900 p-2 rounded-md text-sm overflow-x-auto">
                        {result.input}
                      </pre>
                    </div>
                    {result.error ? (
                      <div>
                        <span className="text-red-400">Error:</span>
                        <pre className="bg-red-900 p-2 rounded-md text-sm text-red-300 overflow-x-auto">
                          {result.error}
                        </pre>
                      </div>
                    ) : (
                      <div>
                        <span className="text-green-400">Output:</span>
                        <pre className="bg-gray-900 p-2 rounded-md text-sm text-green-300 overflow-x-auto">
                          {result.output}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Problem Content */}
          {activeTab === "description" && <Description questions={questions} />}
        </div>
        {/* Right Panel - Editor and Console */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <EditorHeader
            handleRunCode={handleRunCode}
            handleSubmitCode={handleSubmitCode}
            isRunning={isRunning}
            languageName={languageName}
            setLanguageName={setLanguageName}
            setCode={setCode}
            theme={theme}
            setTheme={setTheme}
          />

          {/* Editor */}
          <div className="flex-1 flex-col">
            <Editor
              currentLanguage={languageName}
              currentTheme={theme}
              currentCode={code}
              setCurrentCode={handleEditorChange}
              testCases={testCases}
              activeTestCase={activeTestCase}
              setActiveTestCase={setActiveTestCase}
              setTestCases={setTestCases}
              currentTestCase={currentTestCase}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
