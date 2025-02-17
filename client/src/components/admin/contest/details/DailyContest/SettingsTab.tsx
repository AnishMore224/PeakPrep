import React from "react";
import { DailyContestType } from "../../../../../types";

interface SettingsTabProps {
  contest: DailyContestType;
  handleSettingsChange: (field: keyof DailyContestType, value: any) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ contest, handleSettingsChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold mb-6">Contest Settings</h2>
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Contest Title</label>
          <input 
            type="text" 
            value={contest.title}
            onChange={(e) => handleSettingsChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            value={contest.description}
            onChange={(e) => handleSettingsChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input 
              type="datetime-local" 
              value={new Date(contest.startTime).toISOString().slice(0, 16)}
              onChange={(e) => handleSettingsChange('startTime', new Date(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input 
              type="datetime-local"
              value={new Date(contest.endTime).toISOString().slice(0, 16)}
              onChange={(e) => handleSettingsChange('endTime', new Date(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Rules</label>
          <textarea 
            value={contest.rules}
            onChange={(e) => handleSettingsChange('rules', e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

export default SettingsTab;