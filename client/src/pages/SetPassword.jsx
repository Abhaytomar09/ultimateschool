import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters long.');
        }

        setLoading(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/auth/set-password/${token}`, { password });
            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Animated Background */}
            <div className="bg-animation">
                <div className="blob b1"></div>
                <div className="blob b2"></div>
                <div className="blob b3"></div>
            </div>

            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <span className="logo-icon">US</span>
                        <h2>UltimateSchool</h2>
                    </div>
                    <h3>Set Your Password</h3>
                    <p className="login-subtitle">
                        {success 
                            ? "Password updated successfully!" 
                            : "Please enter a strong password for your new account."}
                    </p>
                </div>

                {success ? (
                    <div className="success-banner" style={{ textAlign: 'center', color: '#10B981', padding: '20px' }}>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Redirecting to Login...</h4>
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div className="error-banner">{error}</div>}

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Enter at least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={loading}
                            style={{ marginTop: '10px' }}
                        >
                            {loading ? <span className="spinner"></span> : 'Set Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
