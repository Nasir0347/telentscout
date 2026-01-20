import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function RecruiterDashboard() {
    const [activeTab, setActiveTab] = useState('company');
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // Profile Form
    const [formData, setFormData] = useState({
        company_name: '',
        website: '',
        location: '',
        description: '',
        industry: ''
    });
    const [logoFile, setLogoFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes] = await Promise.all([
                api.get('/user'),
            ]);

            setProfile(userRes.data.recruiter_profile);

            if (userRes.data.recruiter_profile) {
                const p = userRes.data.recruiter_profile;
                setFormData({
                    company_name: p.company_name || '',
                    website: p.website || '',
                    location: p.location || '',
                    description: p.description || '',
                    industry: p.industry || ''
                });
            }

            // Fetch jobs separately
            const jobsRes = await api.get('/my-jobs');
            setJobs(jobsRes.data);

        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('company_name', formData.company_name);
        data.append('website', formData.website);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('industry', formData.industry);

        if (logoFile) {
            data.append('logo', logoFile);
        }

        try {
            await api.post('/profile/recruiter', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Company profile updated!');
            setEditing(false);
            fetchData();
        } catch (error) {
            console.error("Update failed", error);
            alert('Update failed');
        }
    };

    const deleteJob = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            fetchData();
        } catch (error) {
            alert('Failed to delete job');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>

            <div className="flex space-x-4 border-b mb-6">
                <button
                    className={`pb-2 ${activeTab === 'company' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
                    onClick={() => setActiveTab('company')}
                >
                    Company Profile
                </button>
                <button
                    className={`pb-2 ${activeTab === 'jobs' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
                    onClick={() => setActiveTab('jobs')}
                >
                    My Jobs
                </button>
            </div>

            {activeTab === 'company' && (
                <div className="bg-white p-6 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Company Details</h2>
                        <button
                            onClick={() => setEditing(!editing)}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {!editing ? (
                        <div className="space-y-4">
                            {profile?.company_logo && (
                                <img src={`http://localhost:8000/storage/${profile.company_logo}`} alt="Logo" className="h-16 w-16 object-contain" />
                            )}
                            <p><strong>Company Name:</strong> {profile?.company_name || 'N/A'} {profile?.is_verified ? '✅' : ''}</p>
                            <p><strong>Website:</strong> {profile?.website || 'N/A'}</p>
                            <p><strong>Headquarters:</strong> {profile?.location || 'N/A'}</p>
                            <p><strong>Industry:</strong> {profile?.industry || 'N/A'}</p>
                            <p><strong>Description:</strong> {profile?.description || 'N/A'}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Company Name</label>
                                <input type="text" className="w-full border p-2 rounded" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-gray-700">Website</label>
                                <input type="url" className="w-full border p-2 rounded" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-gray-700">Location</label>
                                <input type="text" className="w-full border p-2 rounded" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-gray-700">Industry</label>
                                <input type="text" className="w-full border p-2 rounded" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-gray-700">Description</label>
                                <textarea className="w-full border p-2 rounded" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label className="block text-gray-700">Logo</label>
                                <input type="file" className="w-full border p-2 rounded" onChange={e => setLogoFile(e.target.files[0])} accept="image/*" />
                            </div>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Changes</button>
                        </form>
                    )}
                </div>
            )}

            {activeTab === 'jobs' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Posted Jobs</h2>
                        <Link to="/jobs/create" className="bg-blue-600 text-white px-4 py-2 rounded">
                            + Post New Job
                        </Link>
                    </div>
                    {jobs.length === 0 ? <p>No jobs posted yet.</p> : (
                        jobs.map(job => (
                            <div key={job.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-600">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">{job.title}</h3>
                                        <p className="text-gray-600 text-sm">Status: <span className={job.status === 'open' ? 'text-green-600' : 'text-red-600'}>{job.status.toUpperCase()}</span></p>
                                        <p className="text-sm mt-1">Applications: {job.applications_count}</p>
                                        <p className="text-xs text-gray-500">Posted: {new Date(job.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <Link to={`/jobs/${job.id}/applications`} className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                                            View Applications
                                        </Link>
                                        <button onClick={() => deleteJob(job.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
