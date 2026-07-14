import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard';
import { AuthProvider } from '../src/contexts/AuthContext';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithAuth = (ui) => {
  localStorage.setItem('token', 'fake-token');
  localStorage.setItem('user', JSON.stringify({ name: 'Test User', id: 1 }));
  return render(
    <AuthProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/create')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => 'application/json' },
          json: async () => ({ success: true, data: { message_text: 'Generated mock message', id: 99 } })
        });
      }
      if (url.includes('/messages')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => 'application/json' },
          json: async () => ({
            success: true,
            data: [{ id: 1, message_text: 'My Favorite Message', recipient_name: 'Test Recipient', occasion_name: 'Birthday', tone_name: 'Funny', is_favorite: true, created_at: new Date().toISOString() }]
          })
        });
      }
      return Promise.resolve({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ success: true, data: [] }) });
    });
  });

  it('submits generator form with correct payload shape', async () => {
    renderWithAuth(<Dashboard />);

    // Switch to Generate tab by clicking CRAFT NEW
    const craftNewBtn = await screen.findByRole('button', { name: /CRAFT NEW/i });
    fireEvent.click(craftNewBtn);

    // Fill the form (after clicking CRAFT NEW, the form should be visible)
    const nameInput = await screen.findByLabelText(/Recipient's Name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane' } });

    fireEvent.change(screen.getByDisplayValue(/Friend/i), { target: { value: 'Family' } });
    fireEvent.change(screen.getByDisplayValue(/Birthday/i), { target: { value: 'Anniversary' } });
    fireEvent.change(screen.getByDisplayValue(/Funny/i), { target: { value: 'Casual' } });

    const submitBtn = screen.getByRole('button', { name: /Generate Magic/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // The fetch call for generate should exist
      const generateCall = global.fetch.mock.calls.find(call => call[0].includes('/create'));
      expect(generateCall).toBeDefined();
      const payload = JSON.parse(generateCall[1].body);
      expect(payload).toMatchObject({
        recipient_name: 'Jane',
        relationship: 'Family',
        occasion_name: 'Anniversary',
        tone_name: 'Casual',
        customer_id: 1
      });
    });
  });

  it('renders history list correctly', async () => {
    renderWithAuth(<Dashboard />);

    // Just wait for history item to be rendered in the document
    await waitFor(() => {
      expect(screen.getByText(/For: Test Recipient/i)).toBeInTheDocument();
    });
  });
});
