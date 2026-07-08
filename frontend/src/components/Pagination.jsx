const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-12 mb-8">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`px-6 py-3 font-bold rounded-full transition-all duration-200 ${
                    currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
                Previous
            </button>
            
            <div className="bg-white px-6 py-3 rounded-full font-bold text-gray-900 shadow-sm border border-gray-200">
                Page {currentPage} <span className="text-gray-400 mx-1">of</span> {totalPages}
            </div>
            
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`px-6 py-3 font-bold rounded-full transition-all duration-200 ${
                    currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;