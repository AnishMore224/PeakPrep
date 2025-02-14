import { useState } from 'react';
import { DailyContestForm } from '../../../components/admin/contest/DailyContest';
import { CodingContestForm } from '../../../components/admin/contest/CodingContest';

const CreateContest = () => {
    const [activeTab, setActiveTab] = useState<'daily' | 'coding'>('daily');

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
                    Contest Creation
                </h1>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setActiveTab('daily')}
                            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                                activeTab === 'daily'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Daily Contest
                        </button>
                        <button
                            onClick={() => setActiveTab('coding')}
                            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                                activeTab === 'coding'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Coding Contest
                        </button>
                    </div>

                    {activeTab === 'daily' ? <DailyContestForm /> : <CodingContestForm />}
                </div>
            </div>
        </div>
    );
}

export default CreateContest;
