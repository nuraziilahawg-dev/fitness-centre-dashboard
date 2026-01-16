import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '../../../components/Elements/Button/Button';
import memberService from '../../../services/member.service';
import api from '../../../api';

export default function MemberModal({ member, viewMode, onClose, onRefresh }) {

    const initialData = {
        name: '',
        email: '',
        phone: '',
        membership_type: 'Basic',
        join_date: new Date().toISOString().split('T')[0],
        dob: '',
        status: 'active'
    };

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (member) {
            setFormData(member);
            if (member.photo) {
                const baseUrl = api.defaults.baseURL.replace('/api', '');
                setPreviewUrl(`${baseUrl}/storage/${member.photo}`);
            }
        } else {
            setFormData(initialData);
            setPreviewUrl(null);
        }
        setErrors({});
        setSelectedFile(null);
    }, [member]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));

            const updatedData = { ...formData };
            delete updatedData.remove_photo;
            setFormData(updatedData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'photo' && formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        if (selectedFile) {
            data.append('photo', selectedFile);
        }

        try {
            if (member) {
                await memberService.updateMember(member.id, data);
                toast.success('Member updated');
            } else {
                await memberService.createMember(data);
                toast.success('New member added');
            }
            onRefresh();
            onClose();
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors);
        } finally {
            setLoading(false);
        }
    };

    const getInputClass = (fieldName) => `
        w-full mt-1 px-4 py-2.5 rounded-xl border outline-none focus:ring-2 transition-all
        ${viewMode ? 'bg-slate-50 text-slate-500 border-slate-200' : ''}
        ${errors[fieldName] ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'}
    `;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-800">
                        {viewMode ? 'Member Profile' : member ? 'Update Member' : 'Create Member'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-slate-600 ml-1 block mb-3">Profile Photo</label>
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                                            <span className="text-xs">No Image</span>
                                        </div>
                                    )}

                                    {!viewMode && previewUrl && !previewUrl.includes('ui-avatars.com') && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setPreviewUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}`);
                                                setFormData({ ...formData, remove_photo: true });
                                            }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                                            title="Remove Photo"
                                        >
                                            <span className="text-lg font-bold">×</span>
                                        </button>
                                    )}
                                </div>

                                {!viewMode && (
                                    <div className="flex flex-col gap-2">
                                        <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            {member?.photo || selectedFile ? 'Change' : 'Upload'}
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </label>
                                        {selectedFile && (
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded truncate max-w-[150px]" title={selectedFile.name}>
                                                    📄 {selectedFile.name}
                                                </p>
                                                <p className="text-[9px] text-slate-400 ml-1">
                                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.photo && <p className="text-red-500 text-xs mt-2 ml-1">{errors.photo[0]}</p>}
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Full Name</label>
                            <input
                                disabled={viewMode}
                                className={getInputClass('name')}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name[0]}</p>}
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Email Address</label>
                            <input
                                disabled={viewMode}
                                type="email"
                                className={getInputClass('email')}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email[0]}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1">Phone Number</label>
                            <input
                                disabled={viewMode}
                                className={getInputClass('phone')}
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone[0]}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1">Membership Type</label>
                            <select
                                disabled={viewMode}
                                className={getInputClass('membership_type')}
                                value={formData.membership_type}
                                onChange={e => setFormData({ ...formData, membership_type: e.target.value })}
                            >
                                <option value="Basic">Basic</option>
                                <option value="Standard">Standard</option>
                                <option value="Premium">Premium</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1">Join Date</label>
                            <input
                                disabled={viewMode}
                                type="date"
                                className={getInputClass('join_date')}
                                value={formData.join_date}
                                onChange={e => setFormData({ ...formData, join_date: e.target.value })}
                            />
                            {errors.join_date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.join_date[0]}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1">Date of Birth</label>
                            <input
                                disabled={viewMode}
                                type="date"
                                className={getInputClass('dob')}
                                value={formData.dob || ''}
                                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1">Account Status</label>
                            <select
                                disabled={viewMode}
                                className={getInputClass('status')}
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-3">
                        <Button variant="secondary" onClick={onClose} className="flex-1">
                            {viewMode ? 'Close' : 'Cancel'}
                        </Button>
                        {!viewMode && (
                            <Button type="submit" loading={loading} className="flex-1">
                                {member ? 'Update' : 'Create'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}