import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function JobCreate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary_range: '',
        job_type: 'Full-time',
        experience_level: 'Mid',
        deadline: '',
        // skills managed separately if sophisticated UI, else text for now or array logic
        // For simplicity, let's skip required_skills detailed input or parse comma-separated
        skills: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                required_skills: formData.skills.split(',').map(s => s.trim())
            };
            await api.post('/jobs', data);
            alert('Job posted successfully');
            navigate('/dashboard/recruiter');
        } catch (error) {
            console.error("Failed to post job", error);
            alert('Failed to post job');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6">
            <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Job Title</label>
                    <input type="text" className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-gray-700">Description</label>
                    <textarea className="w-full border p-2 rounded" rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
                </div>
                <div>
                    <label className="block text-gray-700">Requirements</label>
                    <textarea className="w-full border p-2 rounded" rows="4" value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} required></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Location</label>
                        <input type="text" className="w-full border p-2 rounded" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Salary Range</label>
                        <input type="text" className="w-full border p-2 rounded" value={formData.salary_range} onChange={e => setFormData({ ...formData, salary_range: e.target.value })} placeholder="e.g. $50k - $70k" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Job Type</label>
                        <select className="w-full border p-2 rounded" value={formData.job_type} onChange={e => setFormData({ ...formData, job_type: e.target.value })}>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Internship</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Experience Level</label>
                        <select className="w-full border p-2 rounded" value={formData.experience_level} onChange={e => setFormData({ ...formData, experience_level: e.target.value })}>
                            <option>Junior</option>
                            <option>Mid</option>
                            <option>Senior</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700">Required Skills (comma separated)</label>
                    <input type="text" className="w-full border p-2 rounded" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="React, Laravel, MySQL" />
                </div>
                <div>
                    <label className="block text-gray-700">Application Deadline</label>
                    <input type="date" className="w-full border p-2 rounded" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-bold">
                    Post Job
                </button>
            </form>
        </div>
    );
}
