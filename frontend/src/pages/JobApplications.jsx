import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';

export default function JobApplications() {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await api.get(`/jobs/${id}`); // Public endpoint, but for title its okay
            setJob(res.data);
        } catch (e) { console.error(e) }
    };

    const fetchData = async () => {
        try {
            const res = await api.get(`/jobs/${id}/applications`);
            setApplications(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (appId, status) => {
        try {
            await api.post(`/applications/${appId}/status`, { status });
            fetchData(); // Refresh
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Applications for: {job?.title}</h1>

            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Candidate</th>
                        <th className="py-2 px-4 border-b">Match Score</th>
                        <th className="py-2 px-4 border-b">Applied At</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Action</th>
                        <th className="py-2 px-4 border-b">Resume</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(app => (
                        <tr key={app.id} className="text-center hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">
                                <div className="font-bold">{app.candidate.name}</div>
                                <div className="text-xs text-gray-500">{app.candidate.email}</div>
                                <div className="text-xs text-gray-500">{app.candidate.candidate_profile?.headline}</div>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <div className={`font-bold ${app.match_score >= 80 ? 'text-green-600' : app.match_score >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                                    {app.match_score}%
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b">{new Date(app.applied_at).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                     ${app.status === 'accepted' || app.status === 'hired' ? 'bg-green-100 text-green-800' :
                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {app.status}
                                </span>
                            </td>
                            <td className="py-2 px-4 border-b space-x-2">
                                {app.status === 'pending' && (
                                    <>
                                        <button onClick={() => updateStatus(app.id, 'shortlisted')} className="text-blue-600 hover:underline">Shortlist</button>
                                        <button onClick={() => updateStatus(app.id, 'rejected')} className="text-red-600 hover:underline">Reject</button>
                                    </>
                                )}
                                {app.status === 'shortlisted' && (
                                    <>
                                        <button onClick={() => updateStatus(app.id, 'hired')} className="text-green-600 hover:underline">Hire</button>
                                        <button onClick={() => updateStatus(app.id, 'rejected')} className="text-red-600 hover:underline">Reject</button>
                                    </>
                                )}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {app.candidate.candidate_profile?.resume_path ? (
                                    <a href={`http://localhost:8000/storage/${app.candidate.candidate_profile.resume_path}`} target="_blank" className="text-blue-600 underline">Link</a>
                                ) : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
