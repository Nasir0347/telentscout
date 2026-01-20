import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f2f2f2] font-sans">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                {/* Logo Text */}
                                <span className="text-primary font-bold text-2xl tracking-tight">TalentScout</span>
                            </Link>
                            <div className="ml-8 flex space-x-6 items-center">
                                <Link to="/" className="text-gray-700 hover:text-primary font-medium border-b-2 border-transparent hover:border-primary py-5">Find jobs</Link>
                                <Link to="/companies" className="text-gray-700 hover:text-primary font-medium border-b-2 border-transparent hover:border-primary py-5">Company reviews</Link>
                                <Link to="/salaries" className="text-gray-700 hover:text-primary font-medium border-b-2 border-transparent hover:border-primary py-5">Salary guide</Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user && user.role === 'recruiter' && (
                                <Link to="/jobs/create" className="text-gray-700 hover:text-primary font-medium mr-4">Post a job</Link>
                            )}

                            {user ? (
                                <div className="flex items-center space-x-4 border-l border-gray-300 pl-4">
                                    <Link to={user.role === 'recruiter' ? "/dashboard/recruiter" : "/dashboard/candidate"} className="text-gray-700 hover:text-primary font-bold">
                                        {user.role === 'recruiter' ? 'Employers / Post Job' : 'Upload your resume'}
                                    </Link>
                                    <button onClick={handleLogout} className="text-primary font-bold hover:underline">Sign out</button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4 border-l border-gray-300 pl-4">
                                    <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}
