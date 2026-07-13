import { useState, useEffect, useCallback, useRef } from 'react';
import { getMedia, deleteMedia } from '../services/mediaService';
import { useDebounce } from './useDebounce';

export const useMedia = () => {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [type, setType] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [toast, setToast] = useState(null);

    // NEW: delete confirmation modal state
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const debouncedSearch = useDebounce(search, 500);
    const toastTimerRef = useRef(null);

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMedia({ search: debouncedSearch.trim(), sort, type, page });
            setMediaList(data.media || (Array.isArray(data) ? data : []));
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError("Unable to load your files. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, sort, type, page]);

    useEffect(() => {
        fetchMedia();
        return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
    }, [fetchMedia]);

    const showToast = (message) => {
        setToast(message);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    };

    // Instead of window.confirm, just opens the modal with the target item
    const handleDeleteTrigger = (mediaItem) => {
        setDeleteTarget(mediaItem);
        setIsDeleteModalOpen(true);
    };

    // Cancel: just close the modal, no delete happens
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    // This is the EXACT same logic that used to run right after window.confirm returned true
    const confirmDelete = async () => {
        const mediaItem = deleteTarget;
        if (!mediaItem) return;

        setIsDeleteModalOpen(false);
        setDeleteTarget(null);

        try {
            setMediaList(prev => prev.filter(item => item._id !== mediaItem._id));
            await deleteMedia(mediaItem._id);
            showToast("🗑️ File deleted.");
            if (mediaList.length === 1 && page > 1) setPage(p => p - 1);
            else fetchMedia();
        } catch (err) {
            fetchMedia();
            alert("Failed to delete file.");
        }
    };

    const handleUploadSuccess = async () => {
        showToast("🎉 Upload successful!");
        setTimeout(() => {
            setPage(1);
            fetchMedia();
        }, 1000);
    };

    const handleRenameSuccess = (id, updatedItem) => {
        setMediaList(prevList =>
            prevList.map(item => item._id === id ? { ...item, ...updatedItem } : item)
        );
        showToast("✏️ File renamed successfully!");
    };

    return {
        mediaList, setMediaList, loading, error, toast,
        search, setSearch, sort, setSort, type, setType, page, setPage, totalPages,
        fetchMedia, showToast,
        handleDeleteTrigger, confirmDelete, cancelDelete, isDeleteModalOpen, deleteTarget,
        handleUploadSuccess, handleRenameSuccess
    };
};