import { useState, useEffect } from 'react';
import { renameMedia } from '../services/mediaService';

const RenameModal = ({ isOpen, onClose, mediaItem, onRenameSuccess }) => {
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mediaItem) {

            setNewName(mediaItem.fileName || ''); 
            setError(null);
        }
    }, [mediaItem, isOpen]);

    if (!isOpen || !mediaItem) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (loading || !newName?.trim() || newName?.trim() === mediaItem.fileName) {
            onClose(); 
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const updatedData = await renameMedia(mediaItem._id, newName.trim());
            onRenameSuccess(mediaItem._id, updatedData.media || updatedData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to rename file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
            <div className="modal-content" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', minWidth: '400px' }}>
                <h3>Rename File</h3>
                
                {error && <div className="error-message" style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ margin: '1.5rem 0' }}>
                        <input 
                            type="text" 
                            value={newName}
                            onChange={(e) => {
                                if (error) setError(null);
                                setNewName(e.target.value);
                            }}
                            disabled={loading}
                            required
                            autoFocus
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button 
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            style={{ padding: '8px 16px', backgroundColor: '#f1f3f5', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'black' }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading || !newName?.trim()}
                            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RenameModal;