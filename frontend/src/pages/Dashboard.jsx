import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMedia, deleteMedia, createShareLink } from '../services/mediaService';
import MediaGrid from '../components/MediaGrid';
import UploadModal from '../components/UploadModal';
import RenameModal from '../components/RenameModal';
import ShareModal from '../components/ShareModal';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate(); 

    const [mediaList, setMediaList] = useState([]);
    const [activeRenameItem, setActiveRenameItem] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeShareItem, setActiveShareItem] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const data = await getMedia();
                setMediaList(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch media:", err);
                setError("Unable to load your files. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchMedia();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // --- UPLOAD HANDLER ---
    const handleUploadSuccess = (newMedia) => {
        setMediaList(prev => [newMedia, ...prev]);
        showToast("✅ Upload successful!");
    };

    // --- RENAME HANDLERS ---
    const handleRenameTrigger = (mediaItem) => {
        setActiveRenameItem(mediaItem);
        setIsRenameModalOpen(true);
    };

    const handleRenameSuccess = (id, updatedItem) => {
        setMediaList(prevList => 
            prevList.map(item => item._id === id ? { ...item, ...updatedItem } : item)
        );
        showToast("✏️ File renamed successfully!");
    };

    // --- DELETE HANDLER ---
    const handleDeleteTrigger = async (mediaItem) => {
        // Native browser confirmation is the cleanest UX for destructive actions
        const confirmDelete = window.confirm(`Are you sure you want to delete "${mediaItem.fileName}"?`);
        if (!confirmDelete) return;

        try {
            await deleteMedia(mediaItem._id);
            // Remove the item from local state immediately (No Refetch)
            setMediaList(prevList => prevList.filter(item => item._id !== mediaItem._id));
            showToast("🗑️ File deleted.");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete file.");
        }
    };

    // --- SHARE HANDLER ---
    const handleShareTrigger = (mediaItem) => {
        setActiveShareItem(mediaItem);
        setIsShareModalOpen(true);
    };

    // --- DOWNLOAD HANDLER ---
    const handleDownloadTrigger = (mediaItem) => {
        // Option 1: If your backend stores a direct file URL (like AWS S3)
        if (mediaItem.fileUrl) {
            window.open(mediaItem.fileUrl, '_blank');
            return;
        }
        
        // Option 2: If your backend streams the download via an endpoint
        // NOTE: We append the auth token so the backend allows the download
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
                {error && <div className="error-banner" style={{ color: 'red' }}>{error}</div>}
                
                {!loading && !error && (
                    <MediaGrid 
                        media={mediaList} 
                        onRenameTrigger={handleRenameTrigger}
                        onDeleteTrigger={handleDeleteTrigger}
                        onShareTrigger={handleShareTrigger}
                        onDownloadTrigger={handleDownloadTrigger}
                    />
                )}
                
                <UploadModal 
                    isOpen={isUploadModalOpen} 
                    onClose={() => setIsUploadModalOpen(false)} 
                    onUploadSuccess={handleUploadSuccess} 
                />

                <RenameModal 
                    isOpen={isRenameModalOpen}
                    onClose={() => {
                        setIsRenameModalOpen(false);
                        setActiveRenameItem(null);
                    }}
                    mediaItem={activeRenameItem}
                    onRenameSuccess={handleRenameSuccess}
                />

                <ShareModal 
                isOpen={isShareModalOpen}
                onClose={() => {
                    setIsShareModalOpen(false);
                    setActiveShareItem(null);
                }}
                mediaItem={activeShareItem}
            />
            </main>
        </div>
    );
};

export default Dashboard;