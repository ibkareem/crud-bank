import axios from 'axios';

async function login(id, password) {
  try {

    const response = await axios.post(`${process.env.BASE_URL}/login`, {
      id,
      password,
    });
    if (response.data.token) {
      const token = response.data.token;
      localStorage.setItem('token', token);
      return true;
    }
  } catch (error) {
    return false;
  }
}

export default login;
