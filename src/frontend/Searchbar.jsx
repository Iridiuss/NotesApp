// SearchBar.jsx
import React from 'react';
import { TextField, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <Box mb={1} mt={2} display="flex" justifyContent="flex-end">
            <TextField
                placeholder="Search Notes"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ maxWidth: 200, '& .MuiInputBase-root': { height: 36,borderRadius: '20px',  }, // Sets the height of the input box
                    '& .MuiInputBase-input': { padding: '8px 14px', fontSize: '0.9rem' }, }} // Adjust maxWidth for desired size
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default SearchBar;
