import React, { useState } from 'react';
import { SearchBar } from '../components/GitHubOpenSource/SearchBar';
import { DifficultyFilter } from '../components/GitHubOpenSource/DifficultyFilter';
import { RepositoryList } from '../components/GitHubOpenSource/RepositoryList';
import { Repository, Difficulty } from '../types/index';

const sampleRepositories: Repository[] = [
  {
    id: 1,
    title: "React Component Library",
    description: "A collection of reusable React components with TypeScript support and comprehensive documentation.",
    tags: ["react", "typescript", "ui"],
    difficulty: "intermediate",
    stars: 1240,
  },
  {
    id: 2,
    title: "Node.js API Starter",
    description: "Beginner-friendly Node.js API boilerplate with Express, MongoDB, and authentication.",
    tags: ["nodejs", "express", "mongodb"],
    difficulty: "beginner",
    stars: 856,
  },
  {
    id: 3,
    title: "GraphQL Microservices",
    description: "Advanced microservices architecture using GraphQL, Docker, and Kubernetes.",
    tags: ["graphql", "docker", "kubernetes"],
    difficulty: "advanced",
    stars: 2100,
  }
];

function OpenSource() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');

  const filteredRepos = sampleRepositories.filter(repo => {
    const matchesSearch = repo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = !selectedDifficulty || repo.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Find Your Next Project
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover repositories that match your skills and interests
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8 space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <div className="mt-4">
              <DifficultyFilter value={selectedDifficulty} onChange={setSelectedDifficulty} />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <RepositoryList repositories={filteredRepos} />
        </div>
      </div>
    </div>
  );
}

export default OpenSource;