import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Code } from 'lucide-react';
import Layout from '../../components/ContestCompo/Layout';
import ContestCard from '../../components/ContestCompo/ContestCard';

const Home = () => {
  const navigate = useNavigate();

  const contests = [
    {
      title: "Daily Contest",
      description: "Challenge yourself with our daily MCQ challenges. Test your knowledge and improve your skills!",
      icon: Brain,
      iconColor: "text-purple-600",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      onClick: () => navigate('/daily-contest')
    },
    {
      title: "Weekly Contest",
      description: "Tackle challenging DSA problems and submit your solutions. Compete with others and enhance your coding abilities!",
      icon: Code,
      iconColor: "text-indigo-600",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      onClick: () => navigate('/weekly-contest')
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900">
          Choose Your Challenge
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Select your preferred challenge format and start your coding journey today. 
          Whether you prefer quick MCQs or in-depth problem solving, we've got you covered.
        </p>
        <div className="grid md:grid-cols-2 gap-8 px-4 sm:px-6">
          {contests.map((contest, index) => (
            <ContestCard key={index} {...contest} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;