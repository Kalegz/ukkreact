import { type ReactElement, type ReactNode } from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps): ReactElement | null {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white dark:bg-[#171717] p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-full sm:max-w-lg relative m-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                    aria-label="Close modal"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}