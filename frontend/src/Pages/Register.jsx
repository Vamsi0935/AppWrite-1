import React, { useState, useEffect } from 'react';
import { account } from '../appwrite/config';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Register.css';

const InputField = ({ label, type, value, onChange, error }) => (
    <div className="mb-3 position-relative">
        <label className="form-label">{label}</label>
        <input
            type={type}
            className={error ? "form-control is-invalid" : "form-control"}
            placeholder={label}
            value={value}
            onChange={onChange}
        />
        <div className="invalid-feedback">{error}</div>
    </div>
);

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const user = await account.get();
                if (user) {
                    navigate('/register');
                }
            } catch (err) {
                console.log(err)
            }
        };
        checkSession();
    }, [navigate]);

    const validateForm = () => {
        const formErrors = {};
        if (!fullName) formErrors.fullName = "Full Name is required";
        if (!email) formErrors.email = "Email is required";
        if (!phone) formErrors.phone = "Phone number is required";
        if (!password || password.length < 6) formErrors.password = "Password must be at least 6 characters long";
        return formErrors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setLoading(true);
        setErrors({});
        try {
            await account.create('unique()', email, password, fullName);
            Swal.fire({
                title: 'Success!',
                text: 'Registration successful! You can now log in.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            navigate('/');
        } catch (err) {
            Swal.fire({
                title: 'Error!',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Create your account</h2>
            <form onSubmit={handleRegister}>
                <InputField
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={errors.fullName}
                />
                <InputField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                />
                <InputField
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                />
                <InputField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />
                <button className="btn btn-outline-success" type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
            </form>
            <p>Already have an account? <Link to="/">Sign In</Link></p>
        </div>
    );
};

export default Register;
