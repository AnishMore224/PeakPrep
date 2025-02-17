<<<<<<< HEAD
import React, { useState, useCallback, useMemo } from 'react';
import { useUIContext } from '../../contexts/ui.context';
import { useCompany } from '../../contexts/company.context';
import { SearchBar } from '../../components/SearchBar';
import { CompanyCard } from '../../components/admin/CompanyCard';
=======
import { useState, useCallback, useMemo, useEffect } from "react";
import { useUIContext } from "../../contexts/ui.context";
import { useCompany } from "../../contexts/company.context";
import { SearchBar } from "../../components/SearchBar";
import { CompanyCard } from "../../components/admin/CompanyCard";
import { CompanyData } from "../../types";
>>>>>>> 9b120562b97a2d4746607cae0f1638f795c30127

function ShortListedCompanies() {
  const { isSidebarVisible } = useUIContext();
  const [searchTerm, setSearchTerm] = useState("");
<<<<<<< HEAD
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { companies } = useCompany();
=======
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { getAllCompanies, companies } = useCompany();
>>>>>>> 9b120562b97a2d4746607cae0f1638f795c30127

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value.toLowerCase());
  }, []);

  const handleSort = useCallback((order: 'asc' | 'desc') => {
    setSortOrder(order);
  }, []);
  useEffect(() => {
    getAllCompanies();
  }, [getAllCompanies]);

  const filteredAndSortedCompanies = useMemo(() => {
    let filteredCompanies = companies;
    if (searchTerm) {
      filteredCompanies = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm) ||
          company.hr.some(hr => hr.toLowerCase().includes(searchTerm)) ||
          company.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    return filteredCompanies.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [searchTerm, companies, sortOrder]);

  return (
    <div
      className={`flex-1 bg-gray-50 transition-all duration-300 ${
        isSidebarVisible ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
      }`}
    >
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <SearchBar onSearch={handleSearch} onSort={handleSort} />
          <div className="flex-1 overflow-y-auto p-4">
            {filteredAndSortedCompanies.map((company) => (
              <CompanyCard key={company.name} company={company} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortListedCompanies;