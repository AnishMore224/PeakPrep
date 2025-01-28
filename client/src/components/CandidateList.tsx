import React from 'react';
import { Candidate } from '../types';


const students: Candidate[] = [
  { name: "Alice Johnson", major: "Computer Science", year: "3rd", gpa: 3.8, status: "Active" },
  { name: "Bob Smith", major: "Business", year: "2nd", gpa: 3.5, status: "Active" },
  { name: "Charlie Brown", major: "Engineering", year: "4th", gpa: 3.9, status: "Internship" },
  { name: "Diana Ross", major: "Psychology", year: "1st", gpa: 3.7, status: "Active" },
  { name: "Ethan Hunt", major: "Computer Science", year: "3rd", gpa: 3.6, status: "Active" },
  { name: "Fiona Apple", major: "Music", year: "2nd", gpa: 3.9, status: "Study Abroad" },
  { name: "George Lucas", major: "Film Studies", year: "4th", gpa: 3.7, status: "Active" },
  { name: "Hannah Montana", major: "Business", year: "1st", gpa: 3.5, status: "Active" }
];

export function CandidateList() {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr className="text-left text-blue-600">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Major</th>
                        <th className="py-3 px-4">Year</th>
                        <th className="py-3 px-4">GPA</th>
                        <th className="py-3 px-4">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {students.map((student, index) => (
                        <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                            <td className="py-3 px-4">{student.name}</td>
                            <td className="py-3 px-4">{student.major}</td>
                            <td className="py-3 px-4">{student.year}</td>
                            <td className="py-3 px-4">{student.gpa}</td>
                            <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    student.status === "Active" ? "bg-green-100 text-green-800" :
                                    student.status === "Internship" ? "bg-blue-100 text-blue-800" :
                                    "bg-purple-100 text-purple-800"
                                }`}>
                                    {student.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}