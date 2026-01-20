import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('candidate');
    const [error, setError] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }
        try {
            await register({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                role
            });
            // Redirect based on role
            if (role === 'recruiter') navigate('/dashboard/recruiter');
            else navigate('/dashboard/candidate');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Registration failed');
            if (err.response?.data?.errors) {
                setError(JSON.stringify(err.response.data.errors));
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Join TalentScout</h1>
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Full Name</label>
                        <input type="text" className="w-full border p-2 rounded mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input type="email" className="w-full border p-2 rounded mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input type="password" className="w-full border p-2 rounded mt-1" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Confirm Password</label>
                        <input type="password" className="w-full border p-2 rounded mt-1" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-700">I am a:</label>
                        <select className="w-full border p-2 rounded mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="candidate">Job Seeker (Candidate)</option>
                            <option value="recruiter">Employer (Recruiter)</option>
                        </select>
                    </div>
                    {/* Placeholder for reCAPTCHA */}
                    <div className="border p-2 bg-gray-50 text-center text-sm text-gray-500">
                        reCAPTCHA Protected
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
                </div>
            </div>
        </div>
    );
}
