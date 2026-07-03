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
        <div className="login-container">
            <h2>Welcome Back</h2>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        autoFocus 
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        className="form-input"
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="submit-btn"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            
            <p className="register-link">
                Need an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;