import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function CandidateDashboard() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // Form Config
    const [formData, setFormData] = useState({
        headline: '',
        bio: '',
        skills: '', // Comma separated for input
        experience: '', // Keep simple for now
        phone: '',
        city: ''
    });
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, appRes] = await Promise.all([
                api.get('/user'),
                api.get('/applications/my-applications')
            ]);

            setProfile(userRes.data.candidate_profile);
            setApplications(appRes.data);

            if (userRes.data.candidate_profile) {
                const p = userRes.data.candidate_profile;
                setFormData({
                    headline: p.headline || '',
                    bio: p.bio || '',
                    skills: p.skills ? p.skills.join(', ') : '',
                    experience: p.experience ? JSON.stringify(p.experience) : '',
                    phone: p.phone || '',
                    city: p.city || ''
                });
            }
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('headline', formData.headline);
        data.append('bio', formData.bio);
        data.append('phone', formData.phone);
        data.append('city', formData.city);

        // Convert skills string to array
        const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
        skillsArray.forEach((skill, index) => data.append(`skills[${index}]`, skill));

        if (resumeFile) {
            data.append('resume', resumeFile);
        }

        try {
            await api.post('/profile/candidate', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Profile updated!');
            setEditing(false);
            fetchData();
        } catch (error) {
            console.error("Update failed", error);
            alert('Update failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>

            <div className="flex space-x-4 border-b mb-6">
                <button
                    className={`pb-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    My Profile
                </button>
                <button
                    className={`pb-2 ${activeTab === 'applications' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
                    onClick={() => setActiveTab('applications')}
                >
                    My Applications
                </button>
            </div>

            {activeTab === 'profile' && (
                <div className="bg-white p-6 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Profile Details</h2>
                        <button
                            onClick={() => setEditing(!editing)}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {!editing ? (
                        <div className="space-y-4">
                            <p><strong>Headline:</strong> {profile?.headline || 'N/A'}</p>
                            <p><strong>Location:</strong> {profile?.city || 'N/A'}</p>
                            <p><strong>Phone:</strong> {profile?.phone || 'N/A'}</p>
                            <p><strong>Bio:</strong> {profile?.bio || 'N/A'}</p>
                            <p><strong>Skills:</strong> {profile?.skills?.join(', ') || 'N/A'}</p>
                            <p><strong>Completeness:</strong> {profile?.profile_completeness}%</p>
                            {profile?.resume_path && (
                                <p><strong>Resume:</strong> <a href={`http://localhost:8000/storage/${profile.resume_path}`} target="_blank" className="text-blue-600 underline">Download Resume</a></p>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Headline</label>
                                <input type="text" className="w-full border p-2 rounded" value={formData.headline} onChange={e => setFormData({ ...formData, headline: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700">Phone</label>
                                    <input type="text" className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-gray-700">City</label>
                                    <input type="text" className="w-full border p-2 rounded" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700">Bio</label>
                                <textarea className="w-full border p-2 rounded" rows="3" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label className="block text-gray-700">Skills (comma separated)</label>
                                <input type="text" className="w-full border p-2 rounded" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-gray-700">Resume (PDF/DOC)</label>
                                <input type="file" className="w-full border p-2 rounded" onChange={e => setResumeFile(e.target.files[0])} accept=".pdf,.doc,.docx" />
                            </div>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Changes</button>
                        </form>
                    )}
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="space-y-4">
                    {applications.length === 0 ? <p>No applications yet.</p> : (
                        applications.map(app => (
                            <div key={app.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{app.job?.title}</h3>
                                    <p className="text-gray-600">{app.job?.recruiter?.recruiter_profile?.company_name}</p>
                                    <p className="text-sm text-gray-500">Applied on: {new Date(app.applied_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold 
                                        ${app.status === 'accepted' || app.status === 'hired' ? 'bg-green-100 text-green-800' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {app.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
