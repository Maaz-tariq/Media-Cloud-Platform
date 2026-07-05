import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShareMetadata } from '../services/mediaService';

const ShareView = () => {
    const { token } = useParams();
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const data = await getShareMetadata(token);
                setMetadata(data);
            } catch (err) {
                setError(err.response?.data?.message || "File not found or link has expired.");
            } finally {
                setLoading(false);
            }
        };
        fetchMetadata();
    }, [token]);

    if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    if (error) return <div style={{ color: '#dc3545', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

    
    const backendDownloadUrl = `http://localhost:5000/api/public/shares/${token}/download`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#121212', color: '#fff', padding: '20px' }}>
            <div style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '12px', border: '1px solid #333', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
                <h2 style={{ marginBottom: '20px' }}>Shared File</h2>
                
                <div style={{ width: '100%', height: '250px', backgroundColor: '#2d2d2d', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {metadata?.media?.mediaType?.includes('image') ? (
                        <img 
                            src={backendDownloadUrl} 
                            alt={metadata.media.fileName} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                        />
                    ) : (
                        <span style={{ fontSize: '5rem' }}>📄</span>
                    )}
                </div>

                <h3>{metadata?.media?.fileName}</h3>
                
                <a 
                    href={backendDownloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: '20px', padding: '12px 24px', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}
                >
                    Download File
                </a>
            </div>
        </div>
    );
};

export default ShareView;