import React from 'react';

const JobCard = ({ job, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-card-hover hover:border-gray-300 transition-all cursor-pointer mb-4"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 hover:underline decoration-2">
                        {job.title}
                    </h2>
                    <p className="text-gray-900 mt-1">{job.company}</p>
                    <p className="text-gray-600 text-sm mt-1">{job.location}</p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {job.tags && job.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-4 text-sm text-gray-500">
                Posted {job.postedDate}
            </div>
        </div>
    );
};

export default JobCard;
