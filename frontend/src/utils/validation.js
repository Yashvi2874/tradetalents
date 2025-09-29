// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password validation
export const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

// Name validation
export const validateName = (name) => {
  // At least 2 characters, only letters, spaces, hyphens, and apostrophes
  const re = /^[a-zA-Z\s\-']+$/;
  return re.test(name) && name.length >= 2;
};

// University validation
export const validateUniversity = (university) => {
  // At least 3 characters
  return university.length >= 3;
};

// Validate login form
export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate registration form
export const validateRegisterForm = (data) => {
  const errors = {};

  if (!data.name) {
    errors.name = 'Name is required';
  } else if (!validateName(data.name)) {
    errors.name = 'Please enter a valid name';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!data.university) {
    errors.university = 'University is required';
  } else if (!validateUniversity(data.university)) {
    errors.university = 'Please enter a valid university name';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};