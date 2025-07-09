import React, { useState, useEffect } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

export function CreateUser(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [age, setAge] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        axios.defaults.withCredentials = true;
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const result = await axios.post("https://mern-admindashboard.onrender.com/createUser", { name, email, age });
            console.log(result);
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Error creating entry. Make sure you are logged in.");
        }
    };

    return (
        <div className="d-flex bg-primary vh-100 align-items-center justify-content-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit}>
                    <h2>Create New Entry</h2>
                    <div className="mb-2">
                        <label>Name</label>
                        <input type="text" placeholder="Enter Name" className="form-control" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label>Email</label>
                        <input type="text" placeholder="Enter Email" className="form-control" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label>Age</label>
                        <input type="number" placeholder="Enter Age" className="form-control" onChange={(e) => setAge(e.target.value)} />
                    </div>
                    <button className="btn btn-success">Submit</button>
                </form>
            </div>
        </div>
    );
}
