import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './Signup';
import Main from './Main'; // Import your Notes component

const App = () => {
return (
        <Router>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/notes" element={<Main />} /> {/* Your Notes component */}
                <Route path="/signup" element={<Signup/>} />
            </Routes>
        </Router>
    );
};

export default App;

 
