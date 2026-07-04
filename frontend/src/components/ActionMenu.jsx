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
                ⋮
            </button>

            {isOpen && (
                <div className="action-menu-dropdown" style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 50,
                    minWidth: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <button onClick={() => handleAction(onRename)} className="menu-item">
                        Rename
                    </button>
                    <button onClick={() => handleAction(onDownload)} className="menu-item">
                        Download
                    </button>
                    <button onClick={() => handleAction(onShare)} className="menu-item">
                        Share
                    </button>
                    <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '4px 0' }}></div>
                    <button onClick={() => handleAction(onDelete)} className="menu-item" style={{ color: '#dc3545' }}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActionMenu;