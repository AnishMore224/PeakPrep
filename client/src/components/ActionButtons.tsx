import React from 'react';

export function ActionButtons() {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button className="bg-[#00BCD4] text-white px-4 py-2 rounded-full hover:bg-[#00ACC1] transition-colors text-sm sm:text-base">
        Schedule Interview
      </button>
      <button className="bg-[#00BCD4] text-white px-4 py-2 rounded-full hover:bg-[#00ACC1] transition-colors text-sm sm:text-base">
        Analyze Data
      </button>
      <button className="bg-[#00BCD4] text-white px-4 py-2 rounded-full hover:bg-[#00ACC1] transition-colors text-sm sm:text-base">
        FAQs
      </button>
    </div>
  );
}