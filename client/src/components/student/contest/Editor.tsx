import { useState, useEffect } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { Plus, X } from "lucide-react";

// theme
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { bespin } from "@uiw/codemirror-theme-bespin";
import { duotoneDark, duotoneLight } from "@uiw/codemirror-theme-duotone";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { xcodeDark, xcodeLight } from "@uiw/codemirror-theme-xcode";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { okaidia } from "@uiw/codemirror-theme-okaidia";

// language
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

//configuration
import { bracketMatching, indentUnit } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { closeBrackets } from "@codemirror/autocomplete";

interface TestCase {
  id: number;
  input: string;
  output: string;
}

interface EditorProps {
  currentLanguage: "cpp" | "java" | "javascript" | "python";
  currentTheme:
    | "githubDark"
    | "githubLight"
    | "bespin"
    | "duotoneDark"
    | "duotoneLight"
    | "dracula"
    | "xcodeDark"
    | "xcodeLight"
    | "vscodeDark"
    | "okaidia";
  currentCode: string;
  setCurrentCode: (code: string) => void;
  testCases: TestCase[];
  activeTestCase: number;
  setActiveTestCase: (id: number) => void;
  setTestCases: (testCases: TestCase[]) => void;
currentTestCase: TestCase | null;
  handleInputChange: (id: number, value: string) => void;
}

const Editor = ({
  currentLanguage,
  currentTheme,
  currentCode,
  setCurrentCode,
  testCases,
  activeTestCase,
  setActiveTestCase,
  setTestCases,
  currentTestCase,
  handleInputChange,
}: EditorProps) => {
  const [theme, setTheme] = useState(githubDark);
  const [language, setLanguage] = useState(java);

  const addTestCase = () => {
    const newId = Math.max(0, ...testCases.map((c) => c.id)) + 1;
    setTestCases([...testCases, { id: newId, input: "", output: "" }]);
    setActiveTestCase(newId);
  };

  const removeTestCase = (id: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((c: TestCase) => c.id !== id));
      if (activeTestCase === id) {
        setActiveTestCase(testCases[0].id);
      }
    }
  };
  useEffect(() => {
    if (currentLanguage === "cpp") setLanguage(cpp);
    if (currentLanguage === "java") setLanguage(java);
    if (currentLanguage === "javascript") setLanguage(javascript());
    if (currentLanguage === "python") setLanguage(python);
  }, [currentLanguage]);

  useEffect(() => {
    if (currentTheme === "githubDark") setTheme(githubDark);
    if (currentTheme === "githubLight") setTheme(githubLight);
    if (currentTheme === "bespin") setTheme(bespin);
    if (currentTheme === "duotoneDark") setTheme(duotoneDark);
    if (currentTheme === "duotoneLight") setTheme(duotoneLight);
    if (currentTheme === "dracula") setTheme(dracula);
    if (currentTheme === "xcodeDark") setTheme(xcodeDark);
    if (currentTheme === "xcodeLight") setTheme(xcodeLight);
    if (currentTheme === "vscodeDark") setTheme(vscodeDark);
    if (currentTheme === "okaidia") setTheme(okaidia);
  }, [currentTheme]);

  return (
    <div className="flex flex-col h-full w-full">
      <CodeMirror
      className="overflow-y-auto codeEditor" style={{ height: "50vh" }}
        value={currentCode}
        theme={theme}
        extensions={[
          language,
          indentUnit.of("   "),
          EditorState.changeFilter.of(() => true),
          EditorView.lineWrapping,
          bracketMatching(),
          closeBrackets(),
          EditorView.theme({
            "&": {
              height: "100%", // Ensures the editor takes up all available height
              maxHeight: "50vh", // Limits the height to the viewport height
              overflow: "hidden", // Prevents overflow outside the editor container
            },
          }),
        ]}
        onChange={(value) => setCurrentCode(value)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />

      {/* Console/Testcase Panel */}
      <div className="flex-1 border-t border-gray-700 overflow-y-scroll description">
        <div className="flex items-center px-4 py-2 border-b border-gray-700">
          <span className="text-gray-400">Test Cases</span>
        </div>
        <div className="flex items-center px-4 py-2 border-b border-gray-700">
          <div className="flex-1 flex items-center space-x-2">
            {testCases.map((testCase) => (
              <button
                key={testCase.id}
                onClick={() => setActiveTestCase(testCase.id)}
                className={`px-3 py-1 rounded-md flex items-center space-x-2 ${
                  activeTestCase === testCase.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span>Case {testCase.id}</span>
                {testCases.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTestCase(testCase.id);
                    }}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </button>
            ))}
            <button
              onClick={addTestCase}
              className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-300"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        {currentTestCase && (
          <div className="p-4 font-mono text-sm space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400">Input:</span>
              </div>
              <textarea
                value={currentTestCase.input}
                onChange={(e) =>
                  handleInputChange(currentTestCase.id, e.target.value)
                }
                className="w-full bg-gray-800 text-white p-2 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={2}
              />
            </div>
            {currentTestCase.output && (
              <div>
                <span className="text-gray-400">Output:</span>
                <pre className="mt-1 bg-gray-800 p-2 rounded-md overflow-x-auto">
                  {currentTestCase.output}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
