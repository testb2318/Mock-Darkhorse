
import { useState, useMemo } from 'react';

export const usePagination = (data, itemsPerPage = 50) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data?.slice(startIndex, startIndex + itemsPerPage) || [];
  }, [data, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => 
    Math.ceil((data?.length || 0) / itemsPerPage), 
    [data?.length, itemsPerPage]
  );

  const handlePagination = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    paginatedData,
    handlePagination,
    resetPage
  };
};