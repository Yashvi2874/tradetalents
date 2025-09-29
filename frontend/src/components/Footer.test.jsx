import { render, screen } from '@testing-library/react';
import Footer from './Footer';

// Mock the CSS file import
jest.mock('./Footer.css', () => ({}));

describe('Footer', () => {
  test('renders footer with company name', () => {
    render(<Footer />);
    
    const companyName = screen.getByText(/Trade Talents/i);
    expect(companyName).toBeInTheDocument();
  });

  test('renders quick links', () => {
    render(<Footer />);
    
    const homeLink = screen.getByText(/Home/i);
    const dashboardLink = screen.getByText(/Dashboard/i);
    const loginLink = screen.getByText(/Login/i);
    const registerLink = screen.getByText(/Register/i);
    
    expect(homeLink).toBeInTheDocument();
    expect(dashboardLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });

  test('renders copyright information', () => {
    render(<Footer />);
    
    const copyright = screen.getByText(/All rights reserved/i);
    expect(copyright).toBeInTheDocument();
  });
});