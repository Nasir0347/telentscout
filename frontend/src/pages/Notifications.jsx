import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            // Mark all as read when viewing page
            await api.post('/notifications/read-all');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>
            {notifications.length === 0 ? <p>No notifications.</p> : (
                <div className="space-y-4">
                    {notifications.map(n => (
                        <div key={n.id} className={`p-4 rounded shadow ${n.read_at ? 'bg-white' : 'bg-blue-50 border-l-4 border-blue-600'}`}>
                            <p className="font-bold">{n.data.message}</p>
                            <p className="text-sm text-gray-500">{new Date(n.created_at).toLocaleString()}</p>
                            {n.data.job_id && (
                                <Link to={`/jobs/${n.data.job_id}/applications`} className="text-blue-600 text-sm hover:underline mt-2 block">
                                    View Application
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
