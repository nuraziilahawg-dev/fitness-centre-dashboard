import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function MemberActionButton({ member, onView, onEdit, onDelete }) {
    return (
        <div className="flex justify-end gap-1">
            <button
                onClick={() => onView(member)}
                className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-slate-400 cursor-pointer"
                title="View"
            >
                <Eye size={15} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
                onClick={() => onEdit(member)}
                className="p-2 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors text-slate-400 cursor-pointer"
                title="Edit"
            >
                <Pencil size={15} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
                onClick={() => onDelete(member.id)}
                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-slate-400 cursor-pointer"
                title="Delete"
            >
                <Trash2 size={15} className="group-hover:scale-110 transition-transform" />
            </button>
        </div>
    );
}