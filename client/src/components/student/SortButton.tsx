import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, Check } from "lucide-react";

export interface SortButtonProps {
  sortOrder: "asc" | "desc";
  sortField: "companyName" | "type" | "rating" | "createdAt";
  setSortField: (field: "companyName" | "type" | "rating" | "createdAt") => void;
  handleSort: () => void;
}

const SortButton = ({ sortOrder, sortField, setSortField, handleSort }: SortButtonProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortFields = [
    { id: "companyName", label: "Company Name" },
    { id: "type", label: "Type" },
    { id: "rating", label: "Rating" },
    { id: "createdAt", label: "Date" }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 px-5 py-2.5 border border-gray-200 
                 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-all duration-200 
                 min-w-[200px] group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown 
            size={18} 
            className={`text-gray-500 transition-transform duration-200
                     ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`}
          />
          <span className="text-gray-700 font-medium">
            Sort by {sortFields.find(f => f.id === sortField)?.label}
          </span>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg 
                      shadow-lg z-20 overflow-hidden animate-fadeIn transform origin-top">
          <div className="py-1">
            {sortFields.map((field) => (
              <button
                key={field.id}
                onClick={() => {
                  if (field.id === sortField) {
                    handleSort();
                  } else {
                    setSortField(field.id as "companyName" | "type" | "rating" | "createdAt");
                  }
                  setOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 
                         hover:bg-gray-50 transition-colors duration-150 group"
              >
                <div className="flex items-center gap-2">
                  <span>{field.label}</span>
                  {field.id === sortField && (
                    <span className="text-xs text-gray-500">
                      ({sortOrder === "asc" ? "A → Z" : "Z → A"})
                    </span>
                  )}
                </div>
                {field.id === sortField && (
                  <Check size={16} className="text-blue-600 opacity-100 transition-opacity duration-200" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortButton;