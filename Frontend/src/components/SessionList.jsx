import { useState } from 'react';
import SessionCard from './SessionCard';
import ConfirmationModal from './ConfirmationModal';
import { Loader2, AlertCircle, History } from 'lucide-react';

const SessionList = ({ sessions, isLoading, error, onDeleteSession }) => {
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, sessionId: null });

    const handleDeleteRequest = (sessionId) => {
        setDeleteModal({ isOpen: true, sessionId });
    };

    const confirmDelete = async () => {
        if (!deleteModal.sessionId) return;

        await onDeleteSession(deleteModal.sessionId);
        setDeleteModal({ isOpen: false, sessionId: null });
    };

    const cancelDelete = () => {
        setDeleteModal({ isOpen: false, sessionId: null });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 text-violet-600">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-2 border border-rose-200">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
            </div>
        );
    }

    if (!sessions || sessions.length === 0) {
        return (
            <div className="text-center py-16 bg-white/50 rounded-3xl border border-gray-100">
                <div className="bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <History className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">No Sessions Found</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2">
                    Try adjusting your search or filters, or create a new meditation.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {sessions.map(session => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        onDelete={handleDeleteRequest}
                    />
                ))}
            </div>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Delete Session?"
                message="Are you sure you want to delete this meditation session? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
            />
        </>
    );
};

export default SessionList;
