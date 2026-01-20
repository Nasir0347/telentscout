import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/solid';

const Home = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs?keyword=${keyword}&location=${location}`);
    };

    return (
        <div className="flex flex-col min-h-[80vh] items-center justify-center -mt-10">
            <div className="w-full max-w-4xl px-4">
                {/* Search Container */}
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-md border border-gray-200">

                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-300 px-2">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Job title, keywords, or company"
                            className="w-full p-2 outline-none text-gray-900 placeholder-gray-500"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 flex items-center px-2">
                        <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="City, state, zip code, or remote"
                            className="w-full p-2 outline-none text-gray-900 placeholder-gray-500"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <PrimaryButton type="submit" className="md:w-auto w-full px-8 py-3">
                        Find jobs
                    </PrimaryButton>
                </form>

                {/* Trending / Post your resume callout */}
                <div className="mt-8 text-center">
                    <p className="text-gray-700 font-medium cursor-pointer hover:text-primary hover:underline">
                        Post your resume - It only takes a few seconds
                    </p>
                    <p className="text-gray-700 mt-2 font-medium cursor-pointer hover:text-primary hover:underline">
                        Employers: Post a job - Your next hire is here
                    </p>
                </div>

                {/* Trending Searches */}
                <div className="mt-12 text-center">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Trending Searches</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Remote', 'Customer Service', 'Warehouse', 'Nurse', 'Sales', 'Driver'].map(tag => (
                            <span key={tag}
                                onClick={() => navigate(`/jobs?keyword=${tag}`)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-300 text-sm font-semibold transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
