import React, { useCallback, useMemo, useState } from 'react';
import { companies } from '../utils/compaines';
import { CompanyCard } from '../components/CompanyCard';
import { SearchBar } from '../components/SearchBar';
import { Sidebar } from '../components/Sidebar';
import { useUIContext } from "../contexts/UIContext";

function ShortListedCompanies() {
    const { isSidebarVisible } = useUIContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value.toLowerCase());
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;
    return companies.filter(company => 
      company.title.toLowerCase().includes(searchTerm) || 
      company.description.toLowerCase().includes(searchTerm)
    );
  }, [searchTerm]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex-1 bg-gray-50 transition-all duration-300 ${
        isSidebarVisible ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
      }`}>
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">          
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 pt-0">
              <SearchBar onSearch={handleSearch} />
              
              <div className="space-y-4 mt-6">
                {filteredCompanies.map((company, index) => (
                  <CompanyCard key={index} company={company} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortListedCompanies;