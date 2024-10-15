import React from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css"

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark shadow p-3 mb-5 bg-body-tertiary rounded">
            <div className="container-fluid">
                <h1 className="navbar-brand text-light">Event Management System</h1>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="ms-auto d-flex">
                        <Link to="/" className="nav-link text-light">Login</Link>
                        <Link to="/register" className="nav-link text-light">Register</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
