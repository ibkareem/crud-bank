export function validatePassword(password) {
    // Define the regular expressions for uppercase letter, special character, and length
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    const minLength = 8;
  
    // Check if the password meets all the criteria
    if (
      uppercaseRegex.test(password) &&
      specialCharRegex.test(password) &&
      password.length >= minLength
    ) {
      return true; // Password is valid
    } else {
      return false; // Password is invalid
    }
  }
  