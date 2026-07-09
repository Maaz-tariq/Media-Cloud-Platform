const SortDropdown = ({ value, onChange }) => {
    return (
        <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
             className="appearance-none bg-white text-gray-900 font-bold border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer min-w-[150px]"
        >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="largest">Largest Size</option>
            <option value="smallest">Smallest Size</option>
        </select>
    );
};

export default SortDropdown;