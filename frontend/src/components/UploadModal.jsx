import { useState, useRef } from 'react';
import { uploadMedia } from '../services/mediaService';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fileInputRef = useRef(null); 

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (error) setError(null);
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a file to upload.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await uploadMedia(formData);
            
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; 
            }
            onUploadSuccess(response.media || response);

            onClose(); 
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; 
        }
        onClose();
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', minWidth: '400px' }}>
                <h3>Upload New File</h3>
                
                {error && <div className="error-message" style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</div>}
                
                <div style={{ margin: '1.5rem 0' }}>
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        disabled={loading}
                        ref={fileInputRef} 
                    />
                </div>

                <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button 
                        onClick={handleCancel}
                        disabled={loading}
                        style={{ padding: '8px 16px', backgroundColor: '#f1f3f5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpload}
                        disabled={loading}
                        style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;