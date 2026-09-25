const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('cl_admin_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('cl_admin_token', token);
  } else {
    localStorage.removeItem('cl_admin_token');
  }
}

export function getAuthUser() {
  const user = localStorage.getItem('cl_admin_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

export function setAuthUser(user) {
  if (user) {
    localStorage.setItem('cl_admin_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('cl_admin_user');
  }
}

async function request(endpoint, options = {}) {
  const headers = options.headers || {};
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Public
  getBootstrap: () => request('/public/bootstrap'),
  getServices: () => request('/public/services'),
  getServiceBySlug: (slug) => request(`/public/services/${slug}`),
  getProjects: (category) => request(`/public/projects${category ? `?category=${category}` : ''}`),
  getProjectBySlug: (slug) => request(`/public/projects/${slug}`),
  submitEnquiry: (formData) => request('/public/enquiries', {
    method: 'POST',
    body: formData
  }),
  getGiftProducts: () => request('/public/gift-products'),
  submitCustomOrder: (formData) => request('/public/custom-orders', {
    method: 'POST',
    body: formData
  }),

  // Auth
  login: async (username, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res.token) {
      setAuthToken(res.token);
      setAuthUser(res.user);
    }
    return res;
  },
  logout: () => {
    setAuthToken(null);
    setAuthUser(null);
  },
  getMe: () => request('/auth/me'),

  // Admin Dashboard
  getStats: () => request('/admin/dashboard/stats'),

  // Admin Enquiries
  getEnquiries: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/enquiries${q ? `?${q}` : ''}`);
  },
  updateEnquiry: (id, data) => request(`/admin/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteEnquiry: (id) => request(`/admin/enquiries/${id}`, { method: 'DELETE' }),

  // Admin Services
  getServicesAdmin: () => request('/admin/services'),
  createService: (data) => request('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => request(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => request(`/admin/services/${id}`, { method: 'DELETE' }),

  // Admin Projects
  getProjectsAdmin: () => request('/admin/projects'),
  createProject: (data) => request('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => request(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/admin/projects/${id}`, { method: 'DELETE' }),

  // Categories
  getCategoriesAdmin: () => request('/admin/categories'),

  // Testimonials
  getTestimonialsAdmin: () => request('/admin/testimonials'),
  createTestimonial: (data) => request('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  updateTestimonial: (id, data) => request(`/admin/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTestimonial: (id) => request(`/admin/testimonials/${id}`, { method: 'DELETE' }),

  // Before / After
  getBeforeAfterAdmin: () => request('/admin/before-after'),
  updateBeforeAfter: (id, data) => request(`/admin/before-after/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Settings
  getSettingsAdmin: () => request('/admin/settings'),
  updateSettings: (data) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Media
  getMedia: (search) => request(`/admin/media${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  uploadMedia: (formData) => request('/admin/media/upload', { method: 'POST', body: formData }),
  deleteMedia: (id) => request(`/admin/media/${id}`, { method: 'DELETE' }),

  // Custom Orders & Gifts Admin
  getCustomOrdersAdmin: () => request('/admin/custom-orders'),
  updateCustomOrder: (id, data) => request(`/admin/custom-orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getGiftProductsAdmin: () => request('/admin/gift-products'),
  createGiftProduct: (data) => request('/admin/gift-products', { method: 'POST', body: JSON.stringify(data) }),
  updateGiftProduct: (id, data) => request(`/admin/gift-products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGiftProduct: (id) => request(`/admin/gift-products/${id}`, { method: 'DELETE' })
};
