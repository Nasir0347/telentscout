import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(email, password);
            if (res.user.role === 'recruiter') {
                navigate('/dashboard/recruiter');
            } else if (res.user.role === 'candidate') {
                navigate('/dashboard/candidate');
            } else if (res.user.role === 'admin') {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login to TalentScout</h1>
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full border p-2 rounded mt-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded mt-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {/* Placeholder for reCAPTCHA */}
                    <div className="border p-2 bg-gray-50 text-center text-sm text-gray-500">
                        reCAPTCHA Protected
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-blue-600">Register</Link></p>
                </div>
            </div>
        </div>
    );
}
