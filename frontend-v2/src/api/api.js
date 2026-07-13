const API_BASE_URL = '/api';
const DEFAULT_TIMEOUT_MS = 30000;

const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  
  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The server took too long to respond. Please try again.');
    }
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  } finally {
    window.clearTimeout(timeoutId);
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { error: await response.text() };

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth-expired'));
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || 'An error occurred during the request.');
  }

  return data;
};

export const api = {
  login: (email, password) => authFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  
  register: (name, email, password) => authFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),

  forgotPassword: (email) => authFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  verifyResetCode: (email, otp) => authFetch('/auth/verify-reset-code', {
    method: 'POST',
    body: JSON.stringify({ email, otp })
  }),

  resetPassword: (email, otp, new_password) => authFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, new_password })
  }),
  
  generateMessage: (payload) => authFetch('/create', { // Backend route alias for /messages/generate
    method: 'POST',
    body: JSON.stringify(payload),
    timeoutMs: 60000
  }),

  getMessages: () => authFetch('/messages'),

  getDashboardStats: () => authFetch('/dashboard/stats'),

  saveMessage: (messageId) => authFetch(`/messages/${messageId}/save`, {
    method: 'POST'
  }),

  editMessage: (messageId, message_text) => authFetch(`/messages/${messageId}`, {
    method: 'PUT',
    body: JSON.stringify({ message_text, edited_by: 'customer' })
  }),

  sendEmail: (to_email, to_name, message_text, subject = 'A special message just for you!') => authFetch('/send-email', {
    method: 'POST',
    body: JSON.stringify({ to_email, to_name, message_text, subject })
  })
};
