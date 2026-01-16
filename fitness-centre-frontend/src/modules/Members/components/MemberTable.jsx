import { useState, useEffect } from 'react';
import memberService from '../../../services/member.service';
import MemberActionButton from '../../../components/Elements/Button/MemberActionButton';

export default function MemberTable({ onView, onEdit, onDelete }) {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    const [loading, setLoading] = useState(false);

    const fetchMembers = async (page = 1, search = searchTerm) => {
        setLoading(true);
        try {
            const data = await memberService.getAllMembers(page, search);
            setMembers(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page
            });
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    {/* Search Bar */ }
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchMembers(1, searchTerm);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    return (
        <div className="space-y-4">

            {/* Search Bar */}
            <div className="flex gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border-none focus:ring-0 text-sm outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
                    >
                        CLEAR
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500">#</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Member Name</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Membership Type</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="4" className="py-10 text-center text-slate-400 animate-pulse">Loading data...</td></tr>
                            ) : members.length > 0 ? (
                                members.map((member, index) => (
                                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-2 text-xs font-medium text-slate-400">
                                            {(pagination.current_page - 1) * 10 + (index + 1)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-slate-800">{member.name}</div>
                                            <div className="text-xs text-slate-500">{member.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                                                {member.membership_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-1.5 text-xs font-medium ${member.status === 'active' ? 'text-emerald-600' : 'text-red-400'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-red-300'}`}></span>
                                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <MemberActionButton
                                                member={member}
                                                onView={onView}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="py-10 text-center text-slate-400">No members found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                        Showing page <b>{pagination.current_page}</b> of <b>{pagination.last_page}</b>
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled={pagination.current_page === 1 || loading}
                            onClick={() => fetchMembers(pagination.current_page - 1)}
                            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer"
                        >
                            Previous
                        </button>
                        <button
                            disabled={pagination.current_page === pagination.last_page || loading}
                            onClick={() => fetchMembers(pagination.current_page + 1)}
                            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}