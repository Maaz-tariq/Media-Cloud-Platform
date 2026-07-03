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
        <div className="auth-container">
            <h2>Create an Account</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        autoFocus
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        minLength="6"
                        className="form-input"
                    />
                </div>
                
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
            
            <p className="auth-link">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;