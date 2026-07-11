import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    
    const { login, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (error) setError(null);
        
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
       
        if (loading) return;
        
        try {
          
            const sanitizedCredentials = {
                ...credentials,
                email: credentials.email.trim()
            };
            
            await login(sanitizedCredentials);
            navigate('/dashboard'); 
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An unexpected error occurred during login.";
            setError(errorMessage);
        }
    };

    
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-black ">Welcome Back</h2>
                 {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        autoFocus 
                        placeholder="Email" 
                        className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange} 
                        required 
                        disabled={loading} 
                        className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 mt-2 transition-colors shadow-md hover:shadow-lg"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="register-link">
                Need an account? <Link to="/register">Register here</Link>
            </p>
            </div>
        </div>
    );
};

export default Login;