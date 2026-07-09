import { useState, useRef, useEffect } from 'react';

const ActionMenu = ({ onRename, onDelete, onShare, onDownload }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAction = (actionFn) => {
        setIsOpen(false);
        if (actionFn) actionFn();
    };

    return (
        <div className="action-menu-container" ref={menuRef} style={{ position: 'relative' }}>
                <button 
                    className="action-menu-toggle" 
                    onClick={() => setIsOpen(prev => !prev)}
                    aria-label="File actions"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px' }}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48" 
                        className="w-6 h-6 fill-gray-500 hover:fill-gray-700 transition-colors"
                     >
                        <path d="M6 22H42V26H6zM6 10H42V14H6zM6 34H42V38H6z"></path>
                    </svg>
                </button>
            

            {isOpen && (
                <div className="bg-white border border-gray-100 shadow-lg rounded-xl p-2 flex flex-col gap-1 text-sm">
                    <button onClick={() => handleAction(onRename)} className="px-3 py-1 hover:bg-gray-50 text-left">
                        Rename
                    </button>
                    <button onClick={() => handleAction(onDownload)} className="px-3 py-1 hover:bg-gray-50 text-left">
                        Download
                    </button>
                    <button onClick={() => handleAction(onShare)} className="px-3 py-1 hover:bg-gray-50 text-left">
                        Share
                    </button>
                    <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '4px 0' }}></div>
                    <button onClick={() => handleAction(onDelete)} className="px-3 py-1 hover:bg-gray-50 text-left text-red-600">
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActionMenu;