import React from 'react';
import App from './App';
import { Router } from './Routing';

export default function Root() {
    return (
        <Router>
            <App />
        </Router>
    );
}
