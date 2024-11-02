import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(false); // State to toggle between signup and login
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';

        try {
            const response = await axios.post(url, { username, password });
            // Store the token or user info if needed
            // localStorage.setItem('token', response.data.token); // Optional

            if (isLogin) {
                // Redirect to the notes app after login
                localStorage.setItem('token', response.data.token); // Store token on login
                toast.success(`Logged in as ${username}!`); // Show success toast
                navigate('/notes'); // Change this path to your notes app route
            } else {
                // If signing up, toggle to the login form
                setIsLogin(true);
                toast.success('Registration successful! You can now log in.'); // Show success toast
            }
        } catch (error) {
            console.error(isLogin ? "Login failed:" : "Registration failed:", error);
            toast.error(error.response?.data?.error || 'An error occurred.'); // Show error toast
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h5" align="center">
                {isLogin ? 'Login' : 'Create an Account'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box mt={2}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Box>
                <Box mt={2}>
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Box>
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {isLogin ? 'Login' : 'Create Account'}
                    </Button>
                </Box>
                <Box mt={2}>
                    <Button
                        onClick={() => setIsLogin(!isLogin)}
                        variant="outlined"
                        color="secondary"
                        fullWidth
                    >
                        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default Signup;


