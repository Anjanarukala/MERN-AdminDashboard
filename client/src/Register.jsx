import React, { use } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register(){
    const [username,setUsername]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    
    const navigate=useNavigate();
   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        axios.defaults.withCredentials = true; // Ensure credentials are sent
        const res = await axios.post('http://localhost:3001/register', { username, email, password });
        console.log(res);
        navigate('/login');
    } catch (err) {
        console.error(err);
    }
};

    return(
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white p-3 rounded">
                <h2>Register</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label htmlFor="username">UserName</label>
                        <input name="username" className="form-control" type="text" onChange={(e)=>setUsername(e.target.value)}></input>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input name="email" className="form-control" type="email" onChange={(e)=>setEmail(e.target.value)} ></input>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="password">Password</label>
                        <input name="password" className="form-control" type="password" onChange={(e)=>setPassword(e.target.value)}></input>
                    </div>
                    <button  className="w-100 rounded-0 btn btn-success" >Register</button>
                </form>
                <p>Already have an account?</p>
                <Link to="/login" className="btn btn-outline-success">Login</Link>

            </div>
        </div>
    )
}
export default Register;