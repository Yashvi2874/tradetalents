import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock the CSS file import
jest.mock('./Auth.css', () => ({}));

// Mock the AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

describe('Login', () => {
  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    const heading = screen.getByText(/Login to Your Account/i);
    const emailLabel = screen.getByLabelText(/Email/i);
    const passwordLabel = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    expect(heading).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('renders registration link', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    const registerLink = screen.getByText(/Register here/i);
    expect(registerLink).toBeInTheDocument();
  });
});