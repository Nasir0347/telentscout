import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PrimaryButton from '../components/common/PrimaryButton';
import JobCard from '../components/common/JobCard';
import { MagnifyingGlassIcon, MapPinIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function Jobs() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        location: searchParams.get('location') || '',
        job_type: '',
        experience_level: '',
        date_posted: ''
    });

    // Fetch Jobs
    useEffect(() => {
        fetchJobs();
    }, [searchParams]); // Re-fetch when URL params change

    const fetchJobs = async (customFilters = null) => {
        setLoading(true);
        try {
            const activeFilters = customFilters || filters;
            const params = {
                keyword: activeFilters.keyword,
                location: activeFilters.location,
                job_type: activeFilters.job_type,
                experience_level: activeFilters.experience_level,
                date_posted: activeFilters.date_posted
            };

            // Remove empty keys
            Object.keys(params).forEach(key => !params[key] && delete params[key]);

            const res = await api.get('/jobs', { params });
            const fetchedJobs = res.data.data || res.data;
            setJobs(fetchedJobs);

            if (fetchedJobs.length > 0 && !selectedJob) {
                setSelectedJob(fetchedJobs[0]);
            } else if (fetchedJobs.length === 0) {
                setSelectedJob(null);
            }
        } catch (error) {
            console.error("Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ keyword: filters.keyword, location: filters.location });
        fetchJobs();
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        fetchJobs(newFilters);
    };

    const getDaysPosted = (dateString) => {
        const diff = new Date() - new Date(dateString);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return '1 day ago';
        return `${days} days ago`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
            {/* Top Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-6">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                    />
                </div>
                <div className="flex-1 relative">
                    <MapPinIcon className="h-5 w-5 text-gray-500 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="City, state, zip code, or remote"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    />
                </div>
                <PrimaryButton type="submit" className="md:w-32 py-2">Find jobs</PrimaryButton>
            </form>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Sidebar Filters - Hidden on small mobile? Or standard stack */}
                <div className="w-full md:w-1/4 space-y-4">
                    {/* Job Type Filter */}
                    <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2">Job Type</h3>
                        {['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'].map(type => (
                            <label key={type} className="flex items-center mt-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="job_type"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                    checked={filters.job_type === type}
                                    onChange={() => handleFilterChange('job_type', type)}
                                />
                                <span className="ml-2 text-gray-700">{type}</span>
                            </label>
                        ))}
                        <button onClick={() => handleFilterChange('job_type', '')} className="text-sm text-gray-500 mt-2 hover:underline">Clear</button>
                    </div>

                    {/* Date Posted Filter */}
                    <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2">Date Posted</h3>
                        {[
                            { label: 'Last 24 hours', value: '1' },
                            { label: 'Last 3 days', value: '3' },
                            { label: 'Last 7 days', value: '7' },
                            { label: 'Last 14 days', value: '14' },
                        ].map(opt => (
                            <label key={opt.value} className="flex items-center mt-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="date_posted"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                    checked={filters.date_posted === opt.value}
                                    onChange={() => handleFilterChange('date_posted', opt.value)}
                                />
                                <span className="ml-2 text-gray-700">{opt.label}</span>
                            </label>
                        ))}
                        <button onClick={() => handleFilterChange('date_posted', '')} className="text-sm text-gray-500 mt-2 hover:underline">Clear</button>
                    </div>
                </div>

                {/* Middle Job List */}
                <div className="w-full md:w-5/12">
                    <div className="mb-2 text-sm text-gray-500">
                        {loading ? 'Searching...' : `Found ${jobs.length} jobs`}
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <p>Loading...</p>
                        ) : jobs.length === 0 ? (
                            <div className="bg-white p-8 text-center rounded border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
                                <p className="text-gray-600">Try adjusting your search keywords or filters.</p>
                            </div>
                        ) : (
                            jobs.map(job => (
                                <div
                                    key={job.id}
                                    onClick={() => setSelectedJob(job)}
                                    className={`bg-white border p-4 rounded-lg cursor-pointer hover:border-gray-400 transition-colors ${selectedJob?.id === job.id ? 'border-primary ring-1 ring-primary' : 'border-gray-200'}`}
                                >
                                    <h2 className={`text-lg font-bold mb-1 ${selectedJob?.id === job.id ? 'text-primary' : 'text-gray-900'}`}>{job.title}</h2>
                                    <p className="text-gray-800 text-sm mb-1">{job.recruiter?.recruiter_profile?.company_name || 'Confidential'}</p>
                                    <p className="text-gray-600 text-sm mb-2">{job.location}</p>

                                    <div className="flex gap-2 mb-2">
                                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-bold">
                                            {job.salary_range || 'Salary not provided'}
                                        </span>
                                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-bold">
                                            {job.job_type}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Posted {getDaysPosted(job.created_at)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Job Details (Sticky) */}
                <div className="hidden md:block w-3/12 flex-1 relative">
                    {selectedJob ? (
                        <div className="sticky top-4 bg-white border border-gray-200 rounded-lg p-6 shadow-sm overflow-y-auto max-h-[85vh]">
                            {/* Job Header */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h1>
                            <div className="text-base text-gray-700 mb-4">
                                <a href="#" className="underline hover:text-primary">{selectedJob.recruiter?.recruiter_profile?.company_name}</a>
                                <span className="mx-2">•</span>
                                <span>{selectedJob.location}</span>
                            </div>

                            <PrimaryButton className="w-full mb-6" onClick={() => setShowApplyModal(true)}>Apply now</PrimaryButton>

                            <div className="border-t border-gray-200 pt-4 space-y-4">
                                <div>
                                    <h3 className="font-bold text-gray-900">Job details</h3>
                                    <div className="mt-2 text-sm text-gray-700">
                                        <p><span className="font-semibold">Salary:</span> {selectedJob.salary_range || 'Not specified'}</p>
                                        <p><span className="font-semibold">Job Type:</span> {selectedJob.job_type}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Qualifications</h3>
                                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                        {(selectedJob.required_skills || []).map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Full Job Description</h3>
                                    <div className="text-sm text-gray-700 whitespace-pre-line">
                                        {selectedJob.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="sticky top-4 bg-white border border-gray-200 rounded-lg p-10 shadow-sm text-center">
                            <p className="text-gray-500 text-lg">Select a job to view details</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Application Modal */}
            {selectedJob && showApplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-bold">{selectedJob.title} - Application</h2>
                            <button onClick={() => setShowApplyModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>

                        <p className="mb-4 text-gray-700">Applying to <strong>{selectedJob.recruiter?.recruiter_profile?.company_name}</strong></p>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Cover Letter / Note</label>
                            <textarea
                                className="w-full border border-gray-300 p-2 rounded h-32 focus:ring-1 focus:ring-primary outline-none"
                                placeholder="Explain why you are the best fit for this role..."
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <PrimaryButton onClick={() => {
                                alert("Application functionality is simulated for this demo.");
                                setShowApplyModal(false);
                            }}>
                                Submit Application
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
