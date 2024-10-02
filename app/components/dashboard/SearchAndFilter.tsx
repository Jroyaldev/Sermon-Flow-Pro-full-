// app/components/Dashboard/SearchAndFilter.tsx

import React from 'react';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCompleted: boolean | null;
  setFilterCompleted: (completed: boolean | null) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filterCompleted,
  setFilterCompleted,
}) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded mr-2"
      />
      <select
        value={filterCompleted === null ? '' : filterCompleted.toString()}
        onChange={(e) =>
          setFilterCompleted(e.target.value === '' ? null : e.target.value === 'true')
        }
        className="p-2 border rounded"
      >
        <option value="">All</option>
        <option value="true">Completed</option>
        <option value="false">Incomplete</option>
      </select>
    </div>
  );
};

export default SearchAndFilter;
