import React from 'react';

const DeleteConfirmModal = ({ isOpen, mediaItem, onConfirm, onCancel }) => {
    if (!isOpen || !mediaItem) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">Delete file?</h3>
                <p className="text-sm text-gray-600 font-medium mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-gray-900">"{mediaItem.fileName}"</span>?
                    This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl font-bold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;