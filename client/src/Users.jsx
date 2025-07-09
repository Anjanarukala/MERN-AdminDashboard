import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function Users({ isLoggedIn, setIsLoggedIn }) {
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    const checkAuthStatus = async () => {
        axios.defaults.withCredentials = true;
        try {
            const response = await axios.get('https://mern-admindashboard-server-5ovz.onrender.com/checkAuthStatus');
            if (response.data.isAuthenticated) {
                setIsLoggedIn(true);
                setCurrentUserId(response.data.userId);
            } else {
                setIsLoggedIn(false);
                setCurrentUserId(null);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setCurrentUserId(null);
        }
    };

    useEffect(() => {
        checkAuthStatus();
        axios.defaults.withCredentials = true;
        axios.get('https://mern-admindashboard-server-5ovz.onrender.com')
            .then(result => setUsers(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");
        if (!confirmDelete) return;

        try {
            axios.defaults.withCredentials = true;
            await axios.delete('https://mern-admindashboard-server-5ovz.onrender.com/deleteUser/' + id);
            alert("Record deleted successfully!");
            setUsers(users.filter(user => user._id !== id));
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 403) {
                alert("You are not authorized to delete this data.");
            } else {
                alert("Error deleting data.");
            }
        }
    };

    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            await axios.get('https://mern-admindashboard-server-5ovz.onrender.com/logout');
            setIsLoggedIn(false);
            setCurrentUserId(null);
            navigate('/login');
        } catch (error) {
            console.error("Error during logout:", error);
            alert("Error logging out.");
        }
    };

    return (
        <div className="d-flex vh-100  justify-content-center align-items-center" style={{backgroundColor:"#1E293B"}}>
            <div className="w-75 bg-white rounded v p-3">
                <h2 className="text-center mb-4" style={{
                    fontFamily: "'Segoe UI', sans-serif",
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>
                    Admin Dashboard
                </h2>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    {isLoggedIn && (
                        <Link to="/create" className="btn btn-success">New Entry+</Link>
                    )}
                    {!isLoggedIn ? (
                        <>
                            <Link to="/register" className="btn btn-outline-primary me-2">Register</Link>
                            <Link to="/login" className="btn btn-outline-success">Login</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                    )}
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.age}</td>
                                    <td>
                                        {isLoggedIn && currentUserId === user.owner && (
                                            <>
                                                <Link to={`/update/${user._id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="mt-3 text-muted text-center">
                    * Only owners of the data can edit or delete their entries.
                </p>
            </div>
        </div>
    );
}
