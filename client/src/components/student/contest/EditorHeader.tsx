import React, { useState, Dispatch, SetStateAction } from "react";
import { Maximize2, RefreshCw, Play } from "react-feather";
import { InitialCode } from "../../../pages/student/contest/questions";

interface EditorHeaderProps {
  handleRunCode: () => void;
  handleSubmitCode: () => void;
  isRunning: boolean;
  languageName: "java" | "cpp" | "javascript" | "python";
  setLanguageName: Dispatch<
    SetStateAction<"java" | "cpp" | "javascript" | "python">
  >;
  setCode: Dispatch<SetStateAction<string>>;
  theme: string; // Add the new prop
  setTheme: Dispatch<
    SetStateAction<
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
    >
  >; // Add the new prop
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  handleRunCode,
  handleSubmitCode,
  languageName,
  setLanguageName,
  isRunning,
  setCode,
  setTheme, // Destructure the new prop
  theme, // Add the new prop
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <select
          className="bg-gray-700 text-white px-3 py-1 rounded-md"
          value={languageName}
          onChange={(e) => {
            const selectedLanguage = e.target.value;
            switch (selectedLanguage) {
              case "java":
                setCode(InitialCode.java);
                setLanguageName("java");
                break;
              case "cpp":
                setCode(InitialCode.cpp);
                setLanguageName("cpp");
                break;
              case "javascript":
                setCode(InitialCode.javascript);
                setLanguageName("javascript");
                break;
              case "python":
                setCode(InitialCode.python);
                setLanguageName("python");
                break;
              default:
                setCode(InitialCode.java);
                setLanguageName("java");
                break;
            }
          }}
        >
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>

        <select
          className="bg-gray-700 text-white px-3 py-1 rounded-md"
          value={theme}
          onChange={(e) => {
            const selectedTheme = e.target.value as
              | "vscodeDark"
              | "githubDark"
              | "githubLight"
              | "bespin"
              | "duotoneDark"
              | "duotoneLight"
              | "dracula"
              | "xcodeDark"
              | "xcodeLight"
              | "okaidia";
            setTheme(selectedTheme);
          }}
        >
          <option value="vscodeDark">VSCode Dark</option>
          <option value="githubDark">GitHub Dark</option>
          <option value="githubLight">GitHub Light</option>
          <option value="bespin">Bespin</option>
          <option value="duotoneDark">Duotone Dark</option>
          <option value="duotoneLight">Duotone Light</option>
          <option value="dracula">Dracula</option>
          <option value="xcodeDark">Xcode Dark</option>
          <option value="xcodeLight">Xcode Light</option>
          <option value="okaidia">Okaidia</option>
        </select>
        <button className="text-gray-400 hover:text-white" onClick={() => {}}>
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>Run</span>
        </button>
        <button
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
          onClick={handleSubmitCode}
        >
          <span>Submit</span>
        </button>
      </div>
    </div>
  );
};

export default EditorHeader;
