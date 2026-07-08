import React, { useState } from 'react';

// MOCK SERVICE FOR CANVAS PREVIEW
// In your real project, delete this mock and use: 
// import { createShareLink } from '../services/mediaService';
const createShareLink = async (id) => new Promise(resolve => setTimeout(() => resolve({ shareToken: 'mock-token-123' }), 1000));

const ShareModal = ({ isOpen, onClose, mediaItem }) => {
    const [shareLink, setShareLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    if (!isOpen || !mediaItem) return null;

    const handleGenerateLink = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await createShareLink(mediaItem._id);
            // Assuming the backend returns { shareToken: 'xyz...' }
            const link = `${window.location.origin}/share/${data.shareToken}`;
            setShareLink(link);
            setCopied(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate link.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100 transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-extrabold text-gray-900">Share File</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors text-2xl leading-none">&times;</button>
                </div>

                <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl text-center font-medium mb-6 text-sm">
                    Generate a secure, public link to share <strong className="block mt-1 text-blue-900 truncate">{mediaItem.fileName}</strong>
                </div>
                
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold mb-6 text-sm">{error}</div>}
                
                {!shareLink ? (
                    <button 
                        onClick={handleGenerateLink} 
                        disabled={loading}
                        className={`w-full px-6 py-4 font-bold rounded-full text-white transition-all shadow-md flex justify-center items-center gap-2 ${
                            loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 hover:shadow-lg'
                        }`}
                    >
                        <span>{loading ? 'Generating...' : 'Generate Share Link'}</span>
                        {!loading && <span>🔗</span>}
                    </button>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Public Link</label>
                            <input 
                                type="text" 
                                readOnly 
                                value={shareLink} 
                                className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 text-gray-600 font-medium focus:outline-none"
                            />
                        </div>
                        <button 
                            onClick={handleCopy} 
                            className={`w-full px-6 py-4 font-bold rounded-full transition-all shadow-md flex justify-center items-center gap-2 ${
                                copied ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                            }`}
                        >
                            {copied ? '✅ Copied to Clipboard!' : 'Copy Link'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareModal;