const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Hide pagination entirely if there is only 1 page of results
    if (totalPages <= 1) return null;

    return (
        <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px', padding: '10px' }}>
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                style={{ 
                    padding: '8px 16px', 
                    backgroundColor: currentPage === 1 ? '#444' : '#007bff', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer' 
                }}
            >
                Previous
            </button>
            
            <span style={{ color: '#ccc', fontWeight: 'bold' }}>
                Page {currentPage} of {totalPages}
            </span>
            
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                style={{ 
                    padding: '8px 16px', 
                    backgroundColor: currentPage === totalPages ? '#444' : '#007bff', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' 
                }}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;