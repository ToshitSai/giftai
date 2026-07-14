import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';
import { AuthProvider } from '../src/contexts/AuthContext';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithRouter = (ui) => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('LoginPage Component', () => {
  it('renders login form and validates required fields', async () => {
    renderWithRouter(<LoginPage />);

    // Check elements exist
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Submit without filling fields
    const submitButton = screen.getByRole('button', { name: /CRAFT/i });
    fireEvent.click(submitButton);

    // Since it's a native form, required validation will block submission,
    // or we can test if the form fields have 'required' attribute.
    expect(screen.getByLabelText(/email address/i)).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toBeRequired();
  });
});
