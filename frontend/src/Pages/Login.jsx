import React, { useState, useEffect } from 'react';
import { account } from '../appwrite/config';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Import SweetAlert2
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const user = await account.get();
                if (user) {
                    navigate('/');
                }
            } catch (err) {
                console.log(err);
            }
        };
        checkSession();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await account.createEmailPasswordSession(email, password);
            await Swal.fire({
                title: 'Success!',
                text: 'Login successful!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            navigate('/event'); // Navigate to the event page on successful login
        } catch (err) {
            console.error(err);
            if (err.code === 401) {
                setError('Invalid email or password. Please try again.');
                await Swal.fire({
                    title: 'Error!',
                    text: 'Invalid email or password. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } else {
                setError('An error occurred. Please try again later.');
                await Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="signin-container">
            <h2>Sign In</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        value={email}
                        className="form-control"
                        id="email"
                        placeholder="ex: example@gmail.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        value={password}
                        className="form-control"
                        id="password"
                        placeholder="Enter your secured password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span
                        className="password-toggle-icon"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '38px' }}
                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    >
                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button className="btn btn-outline-success" type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
            </form>
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
    );
};

export default Login;
