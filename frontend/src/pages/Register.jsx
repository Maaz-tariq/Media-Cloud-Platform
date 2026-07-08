import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    
    // 💡 Suggestion 2: Renamed to registerUser
    const { registerUser, loading } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (error) setError(null);
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        
        try {
            // 💡 Suggestion 4: Trim and Lowercase the email
            const sanitizedData = {
                ...formData,
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase() 
            };
            
            await registerUser(sanitizedData);
            
            // 💡 Suggestion 3: Pass a success message to the Login route
            navigate('/login', { 
                state: { message: "Account created successfully. Please log in." } 
            }); 
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An unexpected error occurred during registration.";
            setError(errorMessage);
        }
    };

    return (
         <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">


                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Create Account</h2>

                {error && <div className="error-message">{error}</div>}


                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        placeholder="Full Name"  
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        autoFocus
                        className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        minLength="6"
                        className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                    />
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-full hover:bg-green-700 mt-2 transition-colors shadow-md hover:shadow-lg"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                <p className="auth-link">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
            </div>
        </div>
    );
};

export default Register;