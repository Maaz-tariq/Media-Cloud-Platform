const SortDropdown = ({ value, onChange }) => {
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
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="largest">Largest Size</option>
            <option value="smallest">Smallest Size</option>
        </select>
    );
};

export default SortDropdown;