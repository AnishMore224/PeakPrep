export const contestQuestions = [
  {
    id: 1,
    title: "Sort Matrix by Diagonals",
    difficulty: "Medium",
    description:
      "You are given an `n × n` square matrix of integers `grid`. Return the matrix such that: The diagonals in the bottom-left triangle (including the middle diagonal) are sorted in non-increasing order, and the diagonals in the top-right triangle are sorted in non-decreasing order.",
    points: [
      "The diagonals in the bottom-left triangle (including the middle diagonal) are sorted in non-increasing order.",
      "The diagonals in the top-right triangle are sorted in non-decreasing order.",
    ],
    inputExamples: ["[[1,7,3],[9,8,2],[4,5,6]]", "[[5,1,9],[7,4,6],[8,3,2]]"],
    outputExamples: ["[[8,2,3],[9,6,7],[4,5,1]]", "[[9,4,5],[7,6,8],[1,2,3]]"],
    constraints: ["1 ≤ n ≤ 100", "-10^5 ≤ grid[i][j] ≤ 10^5"],
  },
  {
    id: 2,
    title: "Find Missing Number",
    difficulty: "Easy",
    description:
      "Given an array containing `n` distinct numbers from `0` to `n`, find the missing number.",
    points: ["Return the missing number from the array."],
    inputExamples: ["[3, 0, 1]", "[9, 0, 7, 3, 1, 2, 4, 6, 5]"],
    outputExamples: ["2", "8"],
    constraints: ["1 ≤ n ≤ 10^4", "All numbers are unique"],
  },
  {
    id: 3,
    title: "Reverse Words in a String",
    difficulty: "Medium",
    description:
      "Given a string `s`, reverse the order of words. A word is defined as a sequence of non-space characters.",
    points: [
      "Reverse the order of the words in the string.",
      "Words are separated by spaces.",
    ],
    inputExamples: ['"  hello world  "', '"  the quick brown fox  "'],
    outputExamples: ['"world hello"', '"fox brown quick the"'],
    constraints: [
      "1 ≤ s.length ≤ 10^4",
      "s contains English letters and spaces",
    ],
  },
  {
    id: 4,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.",
    points: [
      "Return the indices of the two numbers that add up to the target.",
    ],
    inputExamples: ["[2,7,11,15], target = 9", "[3,2,4], target = 6"],
    outputExamples: ["[0,1]", "[1,2]"],
    constraints: [
      "2 ≤ nums.length ≤ 10^4",
      "-10^9 ≤ nums[i] ≤ 10^9",
      "Only one valid answer exists",
    ],
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      "Given a string containing just the characters `()[]{}`, determine if the input string is valid.",
    points: ["Return true if the input string is valid, otherwise false."],
    inputExamples: ['"()"', '"()[]{"', '"([{}])"'],
    outputExamples: ['"true"', '"false"', '"true"'],
    constraints: [
      "1 ≤ s.length ≤ 10^4",
      "s consists of parentheses characters only",
    ],
  },
];


export const InitialCode = {
  java: `public class Main {
  public static void main(String[] args) {
      // Write your code here
  }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
  // Write your code here
  return 0;
}
`,
  javascript: `function main() {
  // Write your code here 
}`,
  python: `def main():
  # Write your code here
if __name__ == "__main__":
  main()`,
};
