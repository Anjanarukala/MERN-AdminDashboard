import React from "react"
import axios from 'axios'
import {useState,useEffect} from 'react'
import { useParams,useNavigate } from "react-router-dom"
export function UpdateUser(){
    const {id}=useParams();
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [age,setAge]=useState('')
    const navigate=useNavigate('');

    useEffect(()=>{
             axios.defaults.withCredentials = true;
            axios.get('http://localhost:3001/getUser/'+id)
            .then(result=>{console.log(result)// we must use console, becaue, we should know where the names already given in response.
            setName(result.data.name)
            setEmail(result.data.email)
            setAge((result.data.age))
        }
        )
            .catch(err=>{console.log(err)
                alert("Error fetching user data. you might not have access to update");
                navigate('/');
            })
        },[id,navigate])
    
        const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const result = await axios.put("http://localhost:3001/updateUser/" + id, { name, email, age });
            console.log(result);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 403) {
                alert("You are not authorized to update this data.");
            } else {
                alert("Error updating user. Please try again.");
            }
        }
    };
    return(
        <div className="d-flex  align-items-center justify-content-center bg-primary vh-100">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit}>
                    <h2>Edit User</h2>
                    <div className="mb-2">
                        <label>Name</label>
                        <input type="text" placeholder="Enter Name" className="form-control" onChange={(e)=>setName(e.target.value)} 
                        value={name}></input>
                    </div>
                    <div className="mb-2">
                        <label>Email</label>
                        <input type="text" value={email} placeholder="Enter Email" className="form-control" onChange={(e)=>setEmail(e.target.value)}></input>
                    </div>
                    <div className="mb-2">
                        <label>Age</label>
                        <input type="number" value={age} placeholder="Enter Age" className="form-control" onChange={(e)=>setAge(e.target.value)}></input>
                    </div>
                    <button className=" btn btn-success">Submit</button>
                </form>
            </div>
        </div>
    )
}