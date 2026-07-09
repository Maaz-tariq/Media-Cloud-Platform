import { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMedia, deleteMedia } from '../services/mediaService';
import MediaGrid from '../components/MediaGrid';
import UploadModal from '../components/UploadModal';
import RenameModal from '../components/RenameModal';
import ShareModal from '../components/ShareModal';
import SortDropdown from '../components/SortDropdown';
import FilterDropdown from '../components/FilterDropdown'; 
import Pagination from '../components/Pagination'; 
import { useDebounce } from '../hooks/useDebounce';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate(); 

    const [mediaList, setMediaList] = useState([]);
    const [activeRenameItem, setActiveRenameItem] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [activeShareItem, setActiveShareItem] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //  Filter & Pagination States
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [type, setType] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearch = useDebounce(search, 500);

    const toastTimerRef = useRef(null);
    const showToast = (message) => {
        setToast(message);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    };

const fetchMedia = useCallback(async () => {
        setLoading(true);
        setError(null); 
        
        try {
            const data = await getMedia({
                search: debouncedSearch.trim(),
                sort,
                type,
                page 
            });
            
            // 💡 TEMPORARY DEBUG: Check the browser console to see the exact structure!
            console.log("Backend API Response:", data);
            
            // 💡 THE FIX: Safely fallback to the raw array if data.media doesn't exist yet
            setMediaList(data.media || (Array.isArray(data) ? data : []));
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            console.error("Failed to fetch media:", err);
            setError("Unable to load your files. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, sort, type, page]);

    useEffect(() => {
        fetchMedia();
        return () => {
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        };
    }, [fetchMedia]);


    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); 
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        setPage(1);
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        setPage(1);
    };


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleUploadSuccess = () => {
        showToast("Upload successful!");
        fetchMedia();
    };

    const handleRenameTrigger = (mediaItem) => {
        setActiveRenameItem(mediaItem);
        setIsRenameModalOpen(true);
    };

    const handleRenameSuccess = (id, updatedItem) => {
        setMediaList(prevList => 
            prevList.map(item => item._id === id ? { ...item, ...updatedItem } : item)
        );
        showToast("File renamed successfully!");
    };

    const handleDeleteTrigger = async (mediaItem) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${mediaItem.fileName}"?`);
        if (!confirmDelete) return;

        try {
            await deleteMedia(mediaItem._id);
            setMediaList(prevList => prevList.filter(item => item._id !== mediaItem._id));
            showToast("🗑️ File deleted.");
            
           
            if (mediaList.length === 1 && page > 1) {
                setPage(page - 1);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete file.");
        }
    };

    const handleShareTrigger = (mediaItem) => {
        setActiveShareItem(mediaItem);
        setIsShareModalOpen(true);
    };

    const handleDownloadTrigger = (mediaItem) => {
        if (mediaItem.fileUrl) {
            window.open(mediaItem.fileUrl, '_blank');
            return;
        }
        const token = localStorage.getItem('token');
        const downloadUrl = `http://localhost:5000/api/media/${mediaItem._id}/download?token=${token}`;
        window.open(downloadUrl, '_blank');
        showToast("⬇️ Download started...");
    };

return (
    /* 1. Viewport container blocks default browser scrollbars */
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-gray-900 font-sans selection:bg-blue-200 overflow-hidden">
        {toast && (
            <div className="fixed top-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50 font-bold animate-bounce">
                {toast}
            </div>
        )}

        {/* 2. Main Top Header (Fixed) */}
        <header className="flex justify-between items-center px-8 py-5 bg-white shadow-sm border-b border-gray-100 flex-shrink-0 z-10">
            <div className="flex items-center gap-3">
                <span className="text-black font-bold text-xl">Media Cloud</span>
            </div>
            <div className="flex items-center gap-6">
                <span className="text-gray-600 font-medium">Welcome, {user?.name}</span>
                <button onClick={handleLogout} className="px-6 py-2.5 bg-gray-100 text-black-900 font-bold rounded-full hover:bg-gray-200 transition-colors">
                    Logout
                </button>
            </div>
        </header>

        {/* 3. NEW FIXED CONTROL WRAPPER: Stays frozen under the main header */}
        <div className="w-full bg-slate-50 pt-10 pb-4 px-8 flex-shrink-0 border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto">
                {/* Search & Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
                    <div className="flex flex-wrap gap-4 w-full md:w-auto flex-1">
                        <input 
                            type="text" 
                            placeholder="Search files..."
                            value={search}
                            onChange={handleSearchChange}
                            className="flex-1 md:min-w-[300px] px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                        <FilterDropdown value={type} onChange={handleTypeChange} />
                        <SortDropdown value={sort} onChange={handleSortChange} />
                    </div>
                </div>

                {/* Section Header Row */}
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Your Files</h3>
                    <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-full shadow-md hover:bg-gray-800 transition-colors transform hover:-translate-y-0.5"
                    >
                        Upload File
                    </button>
                </div>
            </div>
        </div>

        {/* 4. EXCLUSIVE SCROLL ZONE: Only the media items list scrolls down */}
        <main className="flex-1 overflow-y-auto px-8 py-6 w-full">
            <div className="max-w-7xl mx-auto">
                
                {loading && <div className="flex justify-center items-center py-20">Loading your files...</div>}
                {error && <div className="bg-red-50 text-red-600 p-6 rounded-3xl text-center font-bold border border-red-100 mb-8">{error}</div>}
                
                {!loading && !error && mediaList.length === 0 && (
                    <div className="text-center bg-white p-20 rounded-3xl border border-gray-100 shadow-sm mt-4">
                        <span className="text-6xl mb-4 block">👻</span>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Nothing is here</h3>
                        <p className="text-gray-500 font-medium">No files found matching your criteria.</p>
                    </div>
                )}

                {!loading && !error && mediaList.length > 0 && (
                    <div className="pb-12">
                        <MediaGrid 
                            media={mediaList} 
                            onRenameTrigger={handleRenameTrigger}
                            onDeleteTrigger={handleDeleteTrigger}
                            onShareTrigger={handleShareTrigger}
                            onDownloadTrigger={handleDownloadTrigger}
                        />
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={setPage} 
                        />
                    </div>
                )}
            </div>
        </main>
        
        {/* Modals Container */}
        <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUploadSuccess={handleUploadSuccess} />
        <RenameModal isOpen={isRenameModalOpen} onClose={() => { setIsRenameModalOpen(false); setActiveRenameItem(null); }} mediaItem={activeRenameItem} onRenameSuccess={handleRenameSuccess} />
        <ShareModal isOpen={isShareModalOpen} onClose={() => { setIsShareModalOpen(false); setActiveShareItem(null); }} mediaItem={activeShareItem} />
    </div>
);

};

export default Dashboard;