import React, { useState, useCallback, useMemo } from 'react';
import { useUIContext } from '../../contexts/ui.context';
import { useCompany } from '../../contexts/company.context';
import { SearchBar } from '../../components/SearchBar';
import { CompanyCard } from '../../components/CompanyCard';
import { Company } from '../../types';

export function AllCompanies() {
  const { isSidebarVisible } = useUIContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { companies } = useCompany();

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value.toLowerCase());
  }, []);

  const handleSort = useCallback((order: 'asc' | 'desc') => {
    setSortOrder(order);
  }, []);

  const filteredAndSortedCompanies = useMemo(() => {
    let filteredCompanies = companies.filter((company): company is Company => 'placed' in company && 'completed' in company);
    if (searchTerm) {
      filteredCompanies = companies.filter((company): company is Company => 
        'placed' in company && 'completed' in company &&
        (company.name.toLowerCase().includes(searchTerm) ||
        company.hr.some(hr => hr.toLowerCase().includes(searchTerm)) ||
        company.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ));
    }
    return filteredCompanies.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [searchTerm, companies, sortOrder]);

  const exportToCSV = () => {
    const csvRows = [];
    const headers = Object.keys(filteredAndSortedCompanies[0]) as (keyof Company)[];
    const headerLabels = headers.map(header => {
      if (Array.isArray((filteredAndSortedCompanies[0] as Company)[header])) {
        return `${header} (comma separated)`;
      }
      return header;
    });
    csvRows.push(headers.join(","));
    for (const company of filteredAndSortedCompanies) {
      const values = headerLabels.map((_, index) => {
        const key = headers[index];
        const value = company[key];
        if (Array.isArray(value)) {
          return value.join(";");
        }
        return value;
      });
      csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "companies.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  return (
    <div
      className={`flex-1 bg-gray-50 transition-all duration-300 ${
        isSidebarVisible ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
      }`}
    >
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <SearchBar onSearch={handleSearch} onSort={handleSort} onExport={exportToCSV}/>
          {/* <button onClick={exportToCSV}>Export to CSV</button> */}
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
