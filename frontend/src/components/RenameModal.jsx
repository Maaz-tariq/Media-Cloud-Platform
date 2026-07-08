import React, { useState, useEffect } from 'react';

// MOCK SERVICE FOR CANVAS PREVIEW
// In your real project, delete this mock and use: 
// import { updateMediaName } from '../services/mediaService';
const updateMediaName = async (id, name) => new Promise(resolve => setTimeout(() => resolve({ fileName: name }), 1000));

const RenameModal = ({ isOpen, onClose, mediaItem, onRenameSuccess }) => {
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mediaItem) {
            setNewName(mediaItem.fileName);
        }
    }, [mediaItem]);

    if (!isOpen || !mediaItem) return null;

    const handleRename = async (e) => {
        e.preventDefault();
        if (!newName.trim() || newName === mediaItem.fileName) return;

        try {
            setLoading(true);
            setError(null);
            const updatedItem = await updateMediaName(mediaItem._id, newName);
            if (onRenameSuccess) onRenameSuccess(mediaItem._id, updatedItem);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to rename file.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100 transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-extrabold text-gray-900">Rename File</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors text-2xl leading-none">&times;</button>
                </div>
                
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold mb-6 text-sm">{error}</div>}
                
                <form onSubmit={handleRename} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">New File Name</label>
                        <input 
                            type="text" 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)} 
                            className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-full hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!newName.trim() || newName === mediaItem.fileName || loading} 
                            className={`flex-1 px-6 py-3 font-bold rounded-full text-white transition-all shadow-md ${
                                !newName.trim() || newName === mediaItem.fileName || loading ? 'bg-yellow-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg'
                            }`}
                        >
                            {loading ? 'Saving...' : 'Save Name'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RenameModal;