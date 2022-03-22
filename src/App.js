import React from 'react';
import Home from './pages/Home/Home';
import PageNotFound from './pages/NotFound/PageNotFound';
import About from './pages/About/About';
import { BrowserRouter as Router, Switch, Route, Routes, Redirect, Link } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route component={PageNotFound} />
            </Routes>
        </Router>
    );
}

export default App;
