import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Login = ({ setAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.user._id);
            setAuth(true);
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response ?.data.msg || 'Error logging in');
            toast.error(err.response ?.data.msg || 'Error logging in');
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div >
        <
        h2 > Login < /h2> {
        error && < p style = {
            { color: 'red' }
        } > { error } < /p>} <
        form onSubmit = { handleSubmit } >
        <
        input type = "email"
        placeholder = "Email"
        value = { email }
        onChange = {
            (e) => setEmail(e.target.value)
        }
        required / >
        <
        input type = "password"
        placeholder = "Password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value)
        }
        required / >
        <
        button type = "submit"
        disabled = { loading } > { loading ? 'Logging in...' : 'Login' } < /button> < /
        form > 
        <p> Don&apos;t have an account? <Link to="/register">Register</Link></p> 
        <p
  style={{ marginTop: "10px", cursor: "pointer", color: "#3b82f6" }}
  onClick={() => (window.location.href = "/forgot-password")}
>
  Forgot Password?
</p>


        < /div >
    );
};

export default Login;