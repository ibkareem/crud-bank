import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './App.css';
import InteractiveForm from './components/InteractiveForm';
import Transactions from './components/Transactions';

// This function checks if the user is authenticated (has a valid token)
const isAuthenticated = () => {
  // Implement your logic to check if the user is authenticated here
  // Return true if authenticated, false otherwise
  // You might retrieve the token from local storage, cookies, or context
  const token = localStorage.getItem('token');
  return token !== null;
};

// A custom PrivateRoute component to handle authentication and authorization
const PrivateRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/home" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/home" element={<InteractiveForm />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/transactions" element={<Transactions />} /> {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
