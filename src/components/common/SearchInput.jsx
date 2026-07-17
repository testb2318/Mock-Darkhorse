
const SearchInput = ({ value, onChange, placeholder = "search here . . ." }) => {
  return (
    <div className="flex justify-end">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        name="search"
        value={value}
        onChange={onChange}
        type="text"
        placeholder={placeholder}
        className="block w-full px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl shadow-sm md:max-w-sm placeholder:text-slate-500 text-white sm:text-base sm:leading-6 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 transition-all"
      />
    </div>
  );
};
export default SearchInput