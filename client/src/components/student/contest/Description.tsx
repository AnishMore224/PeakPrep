interface DescriptionProps {
  questions: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    points: string[];
    inputExamples: string[];
    outputExamples: string[];
    constraints: string[];
  }[];
}
export const Description = ({ questions }: DescriptionProps) => {
  return (
      <div className="flex-1 overflow-y-auto max-h-[85vh] p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 description">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{question.title}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  question.difficulty === "Easy"
                    ? "bg-green-600/20 text-green-500"
                    : "bg-yellow-600/20 text-yellow-500"
                }`}
              >
                {question.difficulty}
              </span>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">{question.description}</p>

              {question.points.length > 0 && (
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  {question.points.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Example:</h3>
                <pre className="bg-gray-700 p-4 rounded-lg text-gray-300 whitespace-pre-wrap">
                  {question.inputExamples.map(
                    (input: string, index: number) => (
                      <div key={index}>
                        <p>
                          <strong>Input {index + 1}:</strong>
                        </p>
                        <p>{input}</p>
                        <p>
                          <strong>Output {index + 1}:</strong>
                        </p>
                        <p>{question.outputExamples[index]}</p>
                        {index < question.inputExamples.length - 1 && (
                          <hr className="my-4 border-gray-600" />
                        )}
                      </div>
                    )
                  )}
                </pre>
              </div>

              {question.constraints.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Constraints:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    {question.constraints.map(
                      (constraint: string, index: number) => (
                        <li key={index}>{constraint}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
  );
};
