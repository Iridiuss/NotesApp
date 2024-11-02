import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Modal, Box, TextField, Grid, Card, CardContent, CardActions, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from './Searchbar';
import axios from 'axios';
import './App.css';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const Main = ({ token }) => {
    const [notes, setNotes] = useState([]);
    const [open, setOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [likedNotes, setLikedNotes] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            const response = await axios.get('http://localhost:5000/notes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes(response.data);
        };
        fetchNotes();
    }, [token]);

    // Conditionally assign filtered notes or all notes
    const filteredNotes = searchQuery
        ? notes.filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : notes; // Default to all notes if search query is empty


    useEffect(() => {
        // Set a timeout to redirect to the login page after 1 hour (3600000 ms)
        const timeout = setTimeout(() => {
            // Clear the token from local storage or state
            localStorage.removeItem('token');
            // Redirect to login page (assumes path is '/login')
            window.location.href = '/login'; // Change to your login path
        }, 3600000); // 1 hour in milliseconds

        return () => clearTimeout(timeout); // Clear timeout on component unmount
    }, []);
    const handleOpen = () => setOpen(true);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        navigate('/signup');// Redirect to the signup/login page
    };

    const handleClose = () => {
        setOpen(false);
        setEditIndex(null);
        setNewNote({ title: '', content: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNote((prevNote) => ({ ...prevNote, [name]: value }));
    };

    const handleSaveNote = async () => {
        if (editIndex !== null) {
            const note = notes[editIndex];
            await axios.put(`http://localhost:5000/notes/${note._id}`, newNote, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes(notes.map((n, index) => (index === editIndex ? newNote : n)));
            toast.success('Updated Note');
        } else {
            const response = await axios.post('http://localhost:5000/notes', newNote, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes([...notes, response.data]);
            toast.success('Added New Note');
        }
        handleClose();
    };

    const handleDeleteNote = async (id) => {
        await axios.delete(`http://localhost:5000/notes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(notes.filter((note) => note._id !== id));
        toast.success('Deleted Note');
    };

    const handleEditNote = (index) => {
        setOpen(true);
        setNewNote(notes[index]);
        setEditIndex(index);
    };

    const handleLikeNote = (id) => {
        if (likedNotes.has(id)) {
            // If already liked, remove the like
            axios.put(`http://localhost:5000/notes/${id}/unlike`) // You need to implement this endpoint on your server
                .then(response => {
                    setNotes(notes.map(note => note._id === id ? response.data : note));
                    setLikedNotes(prev => {
                        const newLikedNotes = new Set(prev);
                        newLikedNotes.delete(id); // Remove the note id from liked notes
                        return newLikedNotes;
                    });
                });
        } else {
            // If not liked, add the like
            axios.put(`http://localhost:5000/notes/${id}/like`)
                .then(response => {
                    setNotes(notes.map(note => note._id === id ? response.data : note));
                    setLikedNotes(prev => new Set(prev).add(id)); // Add the note id to liked notes
                });
        }
    };

    // const handleLikeNote = async (id) => {
    //     if (likedNotes.has(id)) {
    //         // Unlike the note if already liked
    //         await axios.put(`http://localhost:5000/notes/${id}/unlike`, {}, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setLikedNotes(prev => {
    //             const updated = new Set(prev);
    //             updated.delete(id);
    //             return updated;
    //         });
    //     } else {
    //         // Like the note if not already liked
    //         await axios.put(`http://localhost:5000/notes/${id}/like`, {}, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setLikedNotes(prev => new Set(prev).add(id));
    //     }
    //     const response = await axios.get(`http://localhost:5000/notes/${id}`, {
    //         headers: { Authorization: `Bearer ${token}` },
    //     });
    //     setNotes(notes.map(note => note._id === id ? response.data : note));
    // };

    return (
        <Container maxWidth="md" className="app-container">
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
                <Box display="flex" alignItems="center">
                    <EventNoteIcon fontSize="large" sx={{ marginRight: 1 }} />
                    <Typography variant="h4" component="h1" sx={{ lineHeight: 1.5 }}>Notes App</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} sx={{ backgroundColor: 'rgb(255, 196, 10)', color: 'black', marginRight: 1 }}>
                        Create Note
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: 'black' }} onClick={handleLogout}>Logout</Button>
                </Box>
            </Box>
            <Divider />
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> {/* Integrate SearchBar here */}
            {/* <List>
                {filteredNotes.map(note => (
                    <ListItem key={note._id}>
                        <ListItemText primary={note.title} secondary={note.content} />
                    </ListItem>
                ))}
            </List> */}
            <Grid container spacing={2} mt={2} className="main-content">
                {notes.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="h6" align='center'>Create a new note</Typography>
                    </Grid>
                ) : ((searchQuery ? filteredNotes : notes).map((note, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ minHeight: 200, position: 'relative', backgroundColor: 'rgb(255, 243, 230)' }}>
                            <CardContent>
                                <Typography variant='h6' mb={1}>{note.title}</Typography>
                                <Divider />
                                <Typography variant='body2' color='text.secondary' mt={2}>{note.content}</Typography>
                            </CardContent>
                            <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', bottom: 0, right: 0 }}>
                                <IconButton
                                    color={likedNotes.has(note._id) ? "error" : "default"}
                                    onClick={() => handleLikeNote(note._id)}
                                >
                                    <FavoriteIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="body2" color={likedNotes.has(note._id) ? "error" : "text.secondary"} sx={{ marginLeft: 0.1 }}>
                                    {note.likes}
                                </Typography>
                                <IconButton color="error" onClick={() => handleDeleteNote(note._id)}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton color="primary" onClick={() => handleEditNote(index)}>
                                    <EditIcon />
                                </IconButton>

                            </CardActions>
                        </Card>
                    </Grid>
                ))
                )}
            </Grid>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <TextField label="Title" name="title" value={newNote.title} onChange={handleInputChange} fullWidth />
                    <TextField label="Content" name="content" value={newNote.content} onChange={handleInputChange} fullWidth multiline rows={4} sx={{ mt: 2 }} />
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" onClick={handleSaveNote}>
                            {editIndex !== null ? 'Update Note' : 'Save Note'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Box sx={{ textAlign: 'center', mt: 4, pb: 2, borderTop: '1px solid #ccc' }}>
                <Typography variant="body2" color="text.secondary" mt={2}>
                    © {new Date().getFullYear()} My Notes App. All rights reserved.
                </Typography>
            </Box>
        </Container>
    );
};

export default Main;
