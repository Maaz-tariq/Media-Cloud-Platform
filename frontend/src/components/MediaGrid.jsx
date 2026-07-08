import FileCard from './FileCard';

// 💡 1. Make sure you are receiving the triggers here
const MediaGrid = ({ media, onRenameTrigger, onDeleteTrigger, onShareTrigger, onDownloadTrigger }) => {
    if (!media || media.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <span className="text-6xl mb-4">📂</span>
                <p className="text-gray-900 font-bold text-lg">No files uploaded yet.</p>
                <p className="text-gray-500 font-medium">Start by uploading your first file!</p>
            </div>
        );
    }

    return (
        <div  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
                 {media.map((item) => (
                    <div key={item._id} className="transition-all duration-300 hover:scale-[1.02]" >
                        <FileCard 
                    
                    media={item} 
            
                    onRenameTrigger={onRenameTrigger}
                    onDeleteTrigger={onDeleteTrigger}
                    onShareTrigger={onShareTrigger}
                    onDownloadTrigger={onDownloadTrigger}
                />
                    </div>
                
            ))}
        </div>
    );
};

export default MediaGrid;