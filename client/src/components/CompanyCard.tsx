import React from 'react';
import type { Company } from '../types';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = React.memo(({ company }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-indigo-500/50 transition-colors duration-200 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="w-2 h-2 bg-indigo-500 rounded-full" />
          <div>
            <h3 className="font-medium text-slate-800">{company.title}</h3>
            <p className="text-slate-500 text-sm">{company.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap space-x-4">
          <span className="text-slate-500 text-sm">{company.tag1}</span>
          <span className="text-slate-500 text-sm">{company.tag2}</span>
          <span className="text-slate-500 text-sm">{company.tag3}</span>
        </div>
      </div>
      <div className="flex flex-col items-start w-full md:w-auto mt-4 md:mt-0 md:ml-4">
        <button className="px-4 py-2 text-indigo-600 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition-colors duration-200 w-full md:w-auto">
          View Details
        </button>
      </div>
    </div>
  );
});