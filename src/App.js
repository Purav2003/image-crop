import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CropImage from './pages/CropImage';
import UploadImage from './pages/UploadImage';
const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path='/upload' element={<UploadImage />}/>
                    <Route path='/crop' element={<CropImage />}/>
                </Routes>

            </Router>
        </div>
    );
}

export default App;