const FilterDropdown = ({ value, onChange }) => {
    return (
        <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#222',
                color: 'white',
                cursor: 'pointer',
                minWidth: '150px'
            }}
        >
            <option value="">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
            <option value="audio">Audio</option>
        </select>
    );
};

export default FilterDropdown;