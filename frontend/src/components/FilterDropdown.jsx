const FilterDropdown = ({ value, onChange }) => (
    <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white text-gray-900 font-bold border border-gray-200 rounded-full px-6 
        py-3 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
         cursor-pointer min-w-[150px]"
    >
        <option value="">All Files</option>
        <option value="image">Images</option>
        <option value="other">Document</option>
        <option value="video">Videos</option>
        <option value="audio">Audio</option>
    </select>
);

export default FilterDropdown
