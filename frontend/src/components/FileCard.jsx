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
        <div className= "w-full relative flex flex-col bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
            
            <div  className="absolute top-5 right-5 z-10">
                <ActionMenu 
                    onRename={handleRename}
                    onDownload={handleDownload}
                    onShare={handleShare}
                    onDelete={handleDelete}
                />
            </div>

    
            <div className="w-full h-32 bg-gray-50 rounded-2xl mb-4 overflow-hidden flex justify-center items-center border border-gray-100">
                {media.mediaType?.includes('image') && media.fileUrl ? (
                
                    <img 
                        src={media.fileUrl} 
                        alt={media.fileName} 
                        className="w-full h-full object-cover"
                    />
                ) : (
               
                    <span className="text-5xl">📄</span>
                )}
            </div>
            
            <div className="truncate">
                <h4  title={media.fileName} className="font-bold text-gray-900 mb-1 truncate text-lg">
                    {media.fileName}
                </h4>
                <p className="text-sm text-gray-500 font-medium">
                    {formatSize(media.fileSize)} • {new Date(media.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default FileCard;