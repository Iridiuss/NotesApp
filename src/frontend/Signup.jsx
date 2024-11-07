import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import logoImage from './l.png';


const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(false); // State to toggle between signup and login
    const navigate = useNavigate(); // Initialize navigate
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check passwords match before making API call
        if (!isLogin && password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';

        try {
            const response = await axios.post(url, { username, password });

            // Store token and navigate to notes page for both login and register
            localStorage.setItem('token', response.data.token);
            setUsername('');
            setPassword('');
            setConfirmPassword('');

            if (isLogin) {
                toast.success('Welcome back!');
            } else {
                toast.success('Account created successfully!');
            }

            navigate('/notes');
        } catch (error) {
            console.error(isLogin ? "Login failed:" : "Registration failed:", error);
            toast.error(error.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <Grid container sx={{
            margin: '0',
            padding: '0',
            overflow: 'hidden'
        }}>
            {/* Left side - with logo image */}
            <Grid item xs={12} md={8} 
            sx={{
                display: { xs: 'none', md: 'block' },
                backgroundColor: 'white',
                position: 'relative',
                height: '100vh',  // Ensure the Grid takes full height
                overflow: 'hidden'  // Prevent any overflow
            }}
            >
                <Box
                    component="img"
                    src={logoImage}
                    alt="Logo"
                    sx={{
                        width: '95%',
                        height: '100%',
                        objectFit: 'cover',  // Changed to 'cover' to fill the space completely
                        position: 'absolute',  // Position absolutely within the container
                        top: 0,
                        left: 0
                    }}
                />
            </Grid>

            {/* Right side with the signup/login card */}
            <Grid item xs={12} md={4} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',  // Light grey background
                minHeight: '100vh'
            }}>
                <Card sx={{
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: 3,
                    p: 2,
                    m: 2,
                    border: '1px solid grey'
                }}>
                    <CardContent>
                        <Typography component="h1" variant="h5" align="center" gutterBottom>
                            {isLogin ? 'Login' : 'Create Account'}
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
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
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            {!isLogin && (
                                <Box mt={2}>
                                    <TextField
                                        label="Confirm Password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        variant="outlined"
                                        fullWidth
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            )}
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
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Signup;


