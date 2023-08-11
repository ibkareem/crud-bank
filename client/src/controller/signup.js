import axios from 'axios';

async function signup(phone, firstName, lastName, password) {
  try {
    const response = await axios.post(`${process.env.BASE_URL}/signup`, {
      phone,
      firstName,
      lastName,
      password,
    });
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    return null;
  }
}

export default signup;
