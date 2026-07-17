import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-between items-center py-4">
      <button
        onClick={() => onPageChange('prev')}
        disabled={currentPage === 1}
        className="px-4 py-2 text-lg text-white bg-green-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <div className="text-lg text-white">
        Page {currentPage} of {totalPages}
      </div>

      <button
        onClick={() => onPageChange('next')}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-lg text-white bg-[#D4AF37] rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;