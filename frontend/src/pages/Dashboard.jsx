import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MediaGrid from '../components/MediaGrid';
import UploadModal from '../components/UploadModal';
import RenameModal from '../components/RenameModal';
import ShareModal from '../components/ShareModal';
import SortDropdown from '../components/SortDropdown';
import FilterDropdown from '../components/FilterDropdown';
import Pagination from '../components/Pagination';
import { SkeletonGrid } from '../components/SkeletonGrid';
import { useMedia } from '../hooks/useMedia';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [activeRenameItem, setActiveRenameItem] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [activeShareItem, setActiveShareItem] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const {
    mediaList,
    loading, error, toast,
    search, setSearch,
    sort, setSort,
    type, setType,
    page, setPage,
    totalPages,
    handleDeleteTrigger,
    confirmDelete,
    cancelDelete,
    isDeleteModalOpen,
    deleteTarget,
    handleUploadSuccess,
    handleRenameSuccess,
} = useMedia();

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

    const handleRenameTrigger = (mediaItem) => {
        setActiveRenameItem(mediaItem);
        setIsRenameModalOpen(true);
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
        <div className="h-screen w-full flex bg-slate-50 text-gray-900 font-sans selection:bg-blue-200 overflow-hidden relative">
            {toast && (
                <div className="fixed top-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50 font-bold animate-bounce text-sm">
                    {toast}
                </div>
            )}

            {/* MOBILE ONLY OVERLAY */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* DYNAMIC SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col justify-between flex-shrink-0 shadow-sm transition-all duration-300 ease-in-out
                md:relative md:transform-none
                ${isSidebarOpen ? 'translate-x-0 md:w-64 md:opacity-100' : '-translate-x-full md:w-0 md:opacity-0 md:pointer-events-none md:border-r-0'}
            `}>
                <div>
                    <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                        <span
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-black font-extrabold text-xl tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
                        >
                            Media Cloud
                        </span>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-4 flex flex-col gap-6">
                        <button
                            onClick={() => {
                                setIsUploadModalOpen(true);
                                if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-gray-800 transition-colors transform hover:-translate-y-0.5"
                        >
                            <span className="text-lg">+</span> Upload File
                        </button>

                        <nav className="flex flex-col gap-1">
                            <button className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl text-left text-sm w-full">
                                <span>📂</span> All Files
                            </button>
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex flex-col gap-2">
                    <div className="px-2">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Logged in as</p>
                        <p className="text-sm text-gray-700 font-bold truncate">{user?.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-center px-4 py-2 bg-red-800 border border-gray-200 text-white text-xs font-bold rounded-lg hover:bg-red-800 transition-all shadow-sm transform hover:-translate-y-0.5"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* RIGHT VIEWPANE */}
            <div className="flex-1 h-full flex flex-col overflow-hidden w-full transition-all duration-300">
                <header className="w-full bg-white min-h-[4rem] md:h-16 px-4 md:px-8 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between py-3 md:py-0 gap-3 flex-shrink-0 shadow-sm">
                    <div className="flex items-center gap-4 w-full md:flex-1 md:max-w-2xl">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 text-gray-700 hover:bg-gray-100 rounded-xl flex-shrink-0"
                            >
                                ☰
                            </button>
                            {!isSidebarOpen && (
                                <span className="hidden md:block text-black font-extrabold text-xl tracking-tight mr-2 whitespace-nowrap animate-fade-in">
                                    Media Cloud
                                </span>
                            )}
                        </div>

                        <input
                            type="text"
                            placeholder="Search files..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full px-5 py-2 rounded-full bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm shadow-inner"
                        />
                    </div>

                    <div className="flex items-center gap-3 text-sm w-full md:w-auto justify-end">
                        <FilterDropdown value={type} onChange={handleTypeChange} />
                        <SortDropdown value={sort} onChange={handleSortChange} />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 w-full">
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Your Files</h3>
                        </div>

                        {loading && <SkeletonGrid count={8} />}

                        {error && <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold border border-red-100 mb-8">{error}</div>}

                        {!loading && !error && mediaList.length === 0 && (
                            <div className="text-center bg-white p-20 rounded-2xl border border-gray-100 shadow-sm mt-4">
                                <span className="text-6xl mb-4 block">👻</span>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Nothing is here</h3>
                                <p className="text-gray-500 text-sm font-medium">No files found matching your criteria.</p>
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
            </div>

            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUploadSuccess={handleUploadSuccess} />
            <RenameModal isOpen={isRenameModalOpen} onClose={() => { setIsRenameModalOpen(false); setActiveRenameItem(null); }} mediaItem={activeRenameItem} onRenameSuccess={handleRenameSuccess} />
            <ShareModal isOpen={isShareModalOpen} onClose={() => { setIsShareModalOpen(false); setActiveShareItem(null); }} mediaItem={activeShareItem} />
            <DeleteConfirmModal isOpen={isDeleteModalOpen}  mediaItem={deleteTarget}  onConfirm={confirmDelete}  onCancel={cancelDelete} />
        </div>
    );
};

export default Dashboard;