import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const result = await axios.post('http://localhost:3001/login', { email, password });
            console.log(result);

            // Access the 'message' property from the backend response
            if (result.data.message === "success") { // <--- CHANGE IS HERE
                setIsLoggedIn(true);
                navigate('/');
            } else {
                setError(result.data.message); // <--- CHANGE IS HERE: Display the message
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred during login."); // Generic error for network issues
        }
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white p-3 rounded">
                <h2>Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input name="email" className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="password">Password</label>
                        <input name="password" className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                    </div>
                    <button type="submit" className="w-100 rounded-0 btn btn-success">Login</button>
                </form>
                <p className="mt-3">Create New Account</p>
                <Link to="/register" className="btn btn-outline-success">Register</Link>
            </div>
        </div>
    );
}
export default Login;