import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean);
    };

    return ( <
            Router >
            <
            div className = "App" >
            <
            ToastContainer position = "top-right"
            autoClose = { 3000 }
            hideProgressBar = { false }
            /> <
            Routes >
            <
            Route path = "/login"
            element = {!isAuthenticated ? < Login setAuth = { setAuth }
                /> : <Navigate to="/dashboard
                " />} /> <
                Route path = "/register"
                element = {!isAuthenticated ? < Register setAuth = { setAuth }
                    /> : <Navigate to="/dashboard
                    " />} /> <
                    Route path = "/dashboard"
                    element = {
                        isAuthenticated ? < Dashboard setAuth = { setAuth }
                        /> : <Navigate to="/login
                        " />} /> <
                        Route path = "*"
                        element = { < Navigate to = { isAuthenticated ? "/dashboard" : "/login" }
                            />} / >
                            <
                            /Routes> < /
                            div > <
                            /Router>
                        );
                    }

                    export default App;