import toast from 'react-hot-toast';
import { useState } from 'react';
import Button from '../../../components/Elements/Button/Button';
import memberService from '../../../services/member.service';

export default function DeleteMemberModal({ onClose, onConfirm, memberId }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await memberService.deleteMember(memberId);
            toast.success('Member deleted');
            onConfirm();
            onClose();
        } catch (err) {
            toast.error('Failed to delete member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in duration-200">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    ⚠️
                </div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
                <p className="text-slate-500 text-sm mt-2">
                    Are you sure you want to delete this member?
                </p>
                <div className="flex gap-3 mt-6">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button variant="danger" loading={loading} onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}