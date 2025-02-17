import React, { useState } from 'react';
import { X } from 'lucide-react';

interface DeleteConfirmationProps {
    isOpen: boolean;
    contestName: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
    isOpen,
    contestName,
    onClose,
    onConfirm,
}) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue === contestName) {
            onConfirm();
            setInputValue('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <X size={20} />
                </button>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delete Contest</h2>
                
                <p className="text-gray-600 mb-4">
                    This action cannot be undone. Please type <span className="font-medium text-gray-900">"{contestName}"</span> to confirm.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter contest name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={inputValue !== contestName}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeleteConfirmation;