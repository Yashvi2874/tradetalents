import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Mock the CSS file import
jest.mock('./Header.css', () => ({}));

describe('Header', () => {
  test('renders Trade Talents logo', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const logoElement = screen.getByText(/Trade Talents/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const homeLink = screen.getByText(/Home/i);
    const dashboardLink = screen.getByText(/Dashboard/i);
    const loginLink = screen.getByText(/Login/i);
    const registerLink = screen.getByText(/Register/i);
    
    expect(homeLink).toBeInTheDocument();
    expect(dashboardLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });
});