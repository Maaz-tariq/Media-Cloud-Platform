import ActionMenu from './ActionMenu';

const FileCard = ({ media, onRenameTrigger, onDeleteTrigger, onShareTrigger, onDownloadTrigger }) => {
    const formatSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleRename = () => onRenameTrigger && onRenameTrigger(media);
    const handleDelete = () => onDeleteTrigger && onDeleteTrigger(media);
    const handleShare = () => onShareTrigger && onShareTrigger(media);
    const handleDownload = () => onDownloadTrigger && onDownloadTrigger(media);

    return (
        <div className="file-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', padding: '10px' }}>
            
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                <ActionMenu 
                    onRename={handleRename}
                    onDownload={handleDownload}
                    onShare={handleShare}
                    onDelete={handleDelete}
                />
            </div>

    
            <div className="file-preview" style={{ width: '100%', height: '140px', backgroundColor: '#2d2d2d', borderRadius: '6px', marginBottom: '10px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {media.mediaType?.includes('image') && media.fileUrl ? (
                
                    <img 
                        src={media.fileUrl} 
                        alt={media.fileName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                ) : (
               
                    <span style={{ fontSize: '3rem' }}>📄</span>
                )}
            </div>
            
            <div className="file-details" style={{ color: '#fff' }}>
                <h4 className="file-name" title={media.fileName} style={{ margin: '0 0 5px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1rem' }}>
                    {media.fileName}
                </h4>
                <p className="file-meta" style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>
                    {formatSize(media.fileSize)} • {new Date(media.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default FileCard;