import React from 'react';
import { Bell, Users, Plus, Calendar } from 'lucide-react';
import { DashboardMetric, ScheduleItem } from '../types';

const scheduleItems: ScheduleItem[] = [
  { id: '1', title: 'Resume review', time: '10:00 - 10:30', type: 'review' },
  { id: '2', title: 'Mock Interview', time: '11:00 - 12:00', type: 'interview' },
  { id: '3', title: 'Practice session', time: '13:30 - 14:45', type: 'practice' },
  { id: '4', title: 'Analytics Review', time: '15:00 - 15:30', type: 'analytics' },
];

const metrics: DashboardMetric[] = [
  { id: '1', label: 'Number of daily challenges attended', value: 8 },
  { id: '2', label: 'Number of contest attended', value: 16 },
];

export const StudentDashboard: React.FC = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Good morning, Student!</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell size={24} />
          </button>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Your schedule today:</h3>
          <div className="space-y-4">
            {scheduleItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-gray-500">{item.time}</p>
                </div>
                <div className="space-x-2">
                  <button className="px-4 py-1 text-sm bg-blue-500 text-white rounded-full">
                    Reschedule
                  </button>
                  <button className="px-4 py-1 text-sm border border-gray-300 rounded-full">
                    Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Daily Challenges</h3>
              <Users size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Join a Contest</h3>
              <Plus size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Resume</h3>
              <Calendar size={24} />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Challenges Calendar</h3>
          {/* Calendar component would go here */}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Registered Contest</h3>
          <div className="space-y-4">
            {['Code Challenge', 'Coffee Chat', 'Team Stand-up'].map((title) => (
              <div key={title} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <span>{title}</span>
                </div>
                <button className="px-4 py-1 text-sm bg-blue-500 text-white rounded-full">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Performance</h3>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex justify-between items-center">
                <p className="text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};