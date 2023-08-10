import axios from 'axios';

async function getProfile(token) {
  try {
    const response = await axios.get('http://localhost:3000/profile', {
      headers: {
        Authorization: `Bearer ${token}`, // Set the Authorization header
      },
    });
    if (response.data) {
      return response.data; // Return the profile data
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export default getProfile;
