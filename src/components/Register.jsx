import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = ({ setAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('http://localhost:5000/api/auth/register', { email, password });
            localStorage.setItem('token', res.data.token);
            setAuth(true);
            toast.success('Registered successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response ?.data.msg || 'Error registering');
            toast.error(err.response ?.data.msg || 'Error registering');
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div >
        <
        h2 > Register < /h2> {
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
        disabled = { loading } > { loading ? 'Registering...' : 'Register' } < /button> < /
        form > <
        p > Have an account ? < Link to = "/login" > Login < /Link></p >
        <
        /div>
    );
};

export default Register;