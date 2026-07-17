import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 mt-4">
      <button
        onClick={() => onPageChange('prev')}
        disabled={currentPage === 1}
        className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
      >
        <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Previous
      </button>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Page</span>
        <span className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1 text-sm font-semibold text-white bg-white/10 border border-white/10 rounded-lg">
          {currentPage}
        </span>
        <span className="text-xs text-slate-500 font-medium">of</span>
        <span className="text-sm font-semibold text-slate-400">{totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange('next')}
        disabled={currentPage === totalPages}
        className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
      >
        Next
        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
};

export default AdminPagination;
