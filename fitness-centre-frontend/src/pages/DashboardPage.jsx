import { useEffect, useState } from 'react';
import { Users, UserCheck, UserPlus, Award, ArrowRight, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import dashboardService from '../services/dashboard.service';

export default function DashboardPage() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const stats = await dashboardService.getStats();
                setData(stats);
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-slate-500 animate-pulse">Loading dashboard...</div>;

    const chartData = [
        { name: 'Basic', value: data?.basic_members },
        { name: 'Standard', value: data?.standard_members },
        { name: 'Premium', value: data?.premium_members },
    ];

    const COLORS = ['#94a3b8', '#06b6d4', '#f59e0b'];

    const cards = [
        { label: 'Total Members', value: data?.total_members, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Now', value: data?.active_members, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
        // { label: 'Basic', value: data?.basic_members, icon: Zap, color: 'text-slate-600', bg: 'bg-slate-100' },
        // { label: 'Standard', value: data?.standard_members, icon: Shield, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        // { label: 'Premium', value: data?.premium_members, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'New This Month', value: data?.new_this_month, icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                            <card.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{card.label}</p>
                            <h3 className="text-xl font-bold text-slate-800">{card.value || 0}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Member Listing */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Recently Joined Members</h2>
                    <Link to="/members" className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 text-right">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data?.recent_members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-700">{member.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                            ${member.membership_type === 'Premium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-100 text-slate-600'}`}>
                                            {member.membership_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-500 text-sm">{member.join_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> */}

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
                <h2 className="font-bold text-slate-800 mb-4">Membership Type Split</h2>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-center text-xs text-slate-400 mt-4">Distribution by total</p>
            </div>
        </div>
    );
}