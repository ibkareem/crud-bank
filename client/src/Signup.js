import React, { useState } from 'react';
import axios from 'axios';

function SignupForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  // Other form fields and state management

  const handleSignup = async () => {
    try {
        const response = await axios.post('http://localhost:3000/auth/signup', {
            phoneNumber,})
      // Handle response and perform UI updates
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      {/* Other form fields */}
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default SignupForm;
