import FileCard from './FileCard';

// 💡 1. Make sure you are receiving the triggers here
const MediaGrid = ({ media, onRenameTrigger, onDeleteTrigger, onShareTrigger, onDownloadTrigger }) => {
    if (!media || media.length === 0) {
        return (
            <div className="empty-state">
                <p>No files uploaded yet. Start by uploading your first file!</p>
            </div>
        );
    }

    return (
        <div className="media-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {media.map((item) => (
                <FileCard 
                    key={item._id} 
                    media={item} 
            
                    onRenameTrigger={onRenameTrigger}
                    onDeleteTrigger={onDeleteTrigger}
                    onShareTrigger={onShareTrigger}
                    onDownloadTrigger={onDownloadTrigger}
                />
            ))}
        </div>
    );
};

export default MediaGrid;