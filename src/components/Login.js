import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


function Login() {
    const [credential, setCredential] = useState({email:"",password:""});
    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }
    const navigate = useNavigate ();
    const handleSubmit= async(e)=>{
        e.preventDefault();
        const host = "http://localhost:5000"
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email:credential.email,password:credential.password }),
        });
        const json=await response.json();
        console.log(json);
        if(json.success){
            localStorage.setItem("token",json.authtoken)
            navigate("/");
        }else{
            alert("Wrong password")
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" value={credential.email} onChange={onChange} name="email" id="email" aria-describedby="emailHelp" placeholder="Enter email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" value={credential.password} onChange={onChange} name='password' id="password" placeholder="Password"/>
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Login