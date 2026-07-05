import { useState, useEffect } from 'react';
import { createShareLink } from '../services/mediaService';

const ShareModal = ({ isOpen, onClose, mediaItem }) => {
    const [shareUrl, setShareUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

 
    useEffect(() => {
        const generateLink = async () => {
            if (!mediaItem || !isOpen) return;
            
            setLoading(true);
            setError(null);
            setCopied(false);
            setShareUrl('');

            try {
                const data = await createShareLink(mediaItem._id);
                const frontendUrl = `${window.location.origin}/share/${data.shareLink.token}`;
                setShareUrl(frontendUrl);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to generate share link.");
            } finally {
                setLoading(false);
            }
        };

        generateLink();
    }, [mediaItem, isOpen]);

    if (!isOpen || !mediaItem) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); 
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
            <div className="modal-content" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', minWidth: '400px', color: '#333' }}>
                <h3>Share "{mediaItem.fileName || 'File'}"</h3>
                
                {error && <div style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</div>}
                {loading && <div>Generating secure link...</div>}
                
                {!loading && shareUrl && (
                    <div style={{ margin: '1.5rem 0', display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            readOnly 
                            value={shareUrl}
                            style={{ flex: 1, padding: '10px', backgroundColor: '#f1f3f5', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <button 
                            onClick={handleCopy}
                            style={{ padding: '10px 16px', backgroundColor: copied ? '#28a745' : '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                )}

                <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', backgroundColor: '#e9ecef', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;