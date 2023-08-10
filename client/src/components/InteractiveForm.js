import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/Form.css';
import signup from '../controller/signup';
import swal from 'sweetalert2';
import login from '../controller/login';
import { useNavigate } from 'react-router-dom';
import { validatePassword } from '../utils/validatePassword';

function InteractiveForm() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const toggleForm = () => {
    setShowSignUp(!showSignUp);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (phone.length !== 11) {
      swal.fire({
        icon: 'warning',
        title: 'Invalid phone number',
        text: 'Enter a valid phone number',
      });
      return;
    }

    if (!validatePassword(password)) {
      swal.fire({
        icon: 'warning',
        title: 'Invalid Password',
        text: 'Password must contain an uppercase letter, a special character, and be at least 8 characters long.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      swal.fire({
        icon: 'warning',
        title: 'Password mismatch',
        text: 'Passwords do not match',
      });
      return;
    } else {
      setPasswordMatchError(false);
      const response = await signup(phone, firstName, lastName, password);
      if (response) {
        swal.fire({
          icon: 'success',
          title: 'Sign Up Success',
          text: 'Your sign up was successful!',
          confirmButtonText: 'Close',
        });
        await login(response.user.phone, password);
        setShowDashboard(true);
      } else {
        swal.fire({
          icon: 'error',
          title: 'Error while signing up',
          text: 'Unable to sign in at this time',
        });
      }
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const status = await login(phone, password);

    if (status) {
      swal.fire({
        title: 'Login Success',
        icon: 'success',
        confirmButtonText: 'Continue to Dashboard',
        text: 'Your login was successfull',
      });
      setShowDashboard(true);
    } else {
      swal.fire({
        title: 'Login Fail',
        icon: 'error',
        text: 'Incorrect Phone/Account Number or Password',
        timer: 3000,
      });
    }
  };

  const navigate = useNavigate();
  if (showDashboard) {
    navigate('/dashboard');
    return null;
  }
  return (
    <div className="form-container">
      {showSignUp ? (
        <div className="form">
          <h3>Sign Up</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="phone"
                placeholder="Enter phone number..."
                value={phone}
                onChange={handlePhoneChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name..."
                value={firstName}
                onChange={handleFirstNameChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name..."
                value={lastName}
                onChange={handleLastNameChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                isInvalid={passwordMatchError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {passwordMatchError ? 'Passwords do not match' : ''}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="success" type="submit">
              Sign Up
            </Button>
          </Form>
          <p>
            Already have an account?{' '}
            <span className="toggle-link" onClick={toggleForm}>
              Login here
            </span>
          </p>
        </div>
      ) : (
        <Form className="form" onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="phone"
              placeholder="Enter phone number"
              value={phone}
              onChange={handlePhoneChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
          <p>
            Don't have an account?{' '}
            <span className="toggle-link" onClick={toggleForm}>
              Sign up here
            </span>
          </p>
        </Form>
      )}
    </div>
  );
}

export default InteractiveForm;
