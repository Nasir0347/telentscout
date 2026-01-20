import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total_users: 0, total_jobs: 0, total_applications: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data.data);
        } catch (error) {
            console.error("Failed to fetch admin data");
        } finally {
            setLoading(false);
        }
    };

    const verifyRecruiter = async (id) => {
        try {
            await api.post(`/admin/recruiters/${id}/verify`);
            alert('Verified!');
            fetchData();
        } catch (error) {
            alert('Failed');
        }
    };

    const downloadReport = async (type) => {
        try {
            // Trigger browser download
            window.location.href = `http://localhost:8000/api/reports/${type}`;
        } catch (error) {
            alert('Download failed');
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-600 text-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold">Total Users</h2>
                    <p className="text-4xl mt-2">{stats.total_users}</p>
                </div>
                <div className="bg-green-600 text-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold">Total Jobs</h2>
                    <p className="text-4xl mt-2">{stats.total_jobs}</p>
                </div>
                <div className="bg-purple-600 text-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold">Applications</h2>
                    <p className="text-4xl mt-2">{stats.total_applications}</p>
                </div>
            </div>

            <div className="mb-6 flex space-x-4">
                <h2 className="text-xl font-bold">Reports:</h2>
                <button onClick={() => downloadReport('users')} className="bg-gray-700 text-white px-3 py-1 rounded">Export Users</button>
                <button onClick={() => downloadReport('applications')} className="bg-gray-700 text-white px-3 py-1 rounded">Export Applications</button>
            </div>

            {/* Users Table */}
            <div className="bg-white p-6 rounded shadow overflow-x-auto">
                <h2 className="text-xl font-bold mb-4">User Management</h2>
                <table className="min-w-full">
                    <thead>
                        <tr className="text-left bg-gray-50">
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Info</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-t">
                                <td className="p-3">#{user.id}</td>
                                <td className="p-3">
                                    {user.name} <br />
                                    <span className="text-xs text-gray-500">{user.email}</span>
                                </td>
                                <td className="p-3 capitalize">{user.role}</td>
                                <td className="p-3">
                                    {user.role === 'recruiter' && user.recruiter_profile?.company_name}
                                    {user.role === 'recruiter' && user.recruiter_profile?.is_verified && ' ✅'}
                                </td>
                                <td className="p-3">
                                    {user.role === 'recruiter' && !user.recruiter_profile?.is_verified && (
                                        <button
                                            onClick={() => verifyRecruiter(user.recruiter_profile.id)}
                                            className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
