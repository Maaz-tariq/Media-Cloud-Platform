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
        <div className="dashboard-layout">
            {toast && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#333', color: 'white', padding: '12px 24px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 1000 }}>
                    {toast}
                </div>
            )}

            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
                <div className="header-brand">
                    <h2>Media Cloud</h2>
                </div>
                <div className="header-actions">
                    <span className="user-greeting" style={{ marginRight: '15px' }}>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="logout-btn" style={{ padding: '8px 16px', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-content" style={{ padding: '2rem' }}>
                
                
                <div className="toolbar" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder="Search files..."
                        value={search}
                        onChange={handleSearchChange}
                        className="search-input"
                        style={{ flex: 1, minWidth: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }}
                    />
                    
                    <FilterDropdown value={type} onChange={handleTypeChange} />
                    <SortDropdown value={sort} onChange={handleSortChange} />
                </div>

                <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Your Files</h3>
                    <button 
                        className="upload-btn"
                        onClick={() => setIsUploadModalOpen(true)}
                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Upload File
                    </button>
                </div>

                {loading && <div className="loading-spinner">Loading your files...</div>}
                {error && <div className="error-banner" style={{ color: '#dc3545', marginBottom: '20px' }}>{error}</div>}
                
                {!loading && !error && mediaList.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
                        <p>No files found matching your criteria.</p>
                    </div>
                )}

                {!loading && !error && mediaList.length > 0 && (
                    <>
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
                    </>
                )}
                
                {/* ... Modals ... */}
                <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUploadSuccess={handleUploadSuccess} />
                <RenameModal isOpen={isRenameModalOpen} onClose={() => { setIsRenameModalOpen(false); setActiveRenameItem(null); }} mediaItem={activeRenameItem} onRenameSuccess={handleRenameSuccess} />
                <ShareModal isOpen={isShareModalOpen} onClose={() => { setIsShareModalOpen(false); setActiveShareItem(null); }} mediaItem={activeShareItem} />
            </main>
        </div>
    );
};

export default Dashboard;