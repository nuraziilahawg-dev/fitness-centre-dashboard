import { useState } from 'react';
import MemberTable from './components/MemberTable';
import MemberModal from './components/MemberModal';
import DeleteMemberModal from './components/DeleteMemberModal';

export default function MemberPage() {
    const [modalConfig, setModalConfig] = useState({ open: false, member: null, viewMode: false });
    const [deleteConfig, setDeleteConfig] = useState({ open: false, memberId: null });
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refresh = () => setRefreshTrigger(prev => prev + 1);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Member Profile Directory</h1>
                <button
                    onClick={() => setModalConfig({ open: true, member: null, viewMode: false })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer"
                >
                    + Add Member
                </button>
            </div>

            <MemberTable
                key={refreshTrigger}
                onEdit={(m) => setModalConfig({ open: true, member: m, viewMode: false })}
                onView={(m) => setModalConfig({ open: true, member: m, viewMode: true })}
                onDelete={(id) => setDeleteConfig({ open: true, memberId: id })}
            />

            {modalConfig.open && (
                <MemberModal
                    member={modalConfig.member}
                    viewMode={modalConfig.viewMode}
                    onClose={() => setModalConfig({ ...modalConfig, open: false })}
                    onRefresh={refresh}
                />
            )}

            {deleteConfig.open && (
                <DeleteMemberModal
                    onClose={() => setDeleteConfig({ open: false, memberId: null })}
                    onConfirm={refresh}
                    memberId={deleteConfig.memberId}
                />
            )}
        </div>
    );
}