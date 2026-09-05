import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Bearer token to all outgoing requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('ledgercore_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh or 401 expiration
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('ledgercore_refresh_token');
      if (refreshToken) {
        try {
          const refreshRes = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          const newToken = refreshRes.data.accessToken;
          localStorage.setItem('ledgercore_token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('ledgercore_token');
          localStorage.removeItem('ledgercore_refresh_token');
          localStorage.removeItem('ledgercore_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication Endpoints
  ensureAuthenticated() {
    const token = localStorage.getItem('ledgercore_token');
    if (!token) {
      throw new Error('Unauthenticated: Please log in to access this resource.');
    }
    return JSON.parse(localStorage.getItem('ledgercore_user') || '{}');
  },

  async login(email, password) {
    const res = await client.post('/auth/login', { email, password });
    localStorage.setItem('ledgercore_token', res.data.accessToken);
    localStorage.setItem('ledgercore_refresh_token', res.data.refreshToken);
    localStorage.setItem('ledgercore_user', JSON.stringify(res.data.user));
    return res.data;
  },

  async register(email, password, role) {
    const res = await client.post('/auth/register', { email, password, role });
    return res.data;
  },

  async refreshToken(refreshToken) {
    const res = await client.post('/auth/refresh', { refreshToken });
    localStorage.setItem('ledgercore_token', res.data.accessToken);
    return res.data;
  },

  // Account Endpoints
  async getAccounts(page = 0, size = 100, type = null, active = true) {
    await this.ensureAuthenticated();
    const params = new URLSearchParams({ page: String(page), size: String(size), active: String(active) });
    if (type) params.append('type', type);
    const res = await client.get(`/api/v1/accounts?${params.toString()}`);
    return res.data.content || res.data;
  },

  async getAccount(accountId) {
    await this.ensureAuthenticated();
    const res = await client.get(`/api/v1/accounts/${accountId}`);
    return res.data;
  },

  async getAccountBalance(accountId) {
    await this.ensureAuthenticated();
    const res = await client.get(`/api/v1/accounts/${accountId}/balance`);
    return res.data;
  },

  async createAccount(data) {
    await this.ensureAuthenticated();
    const res = await client.post('/api/v1/accounts', data);
    return res.data;
  },

  async updateAccount(accountId, data) {
    await this.ensureAuthenticated();
    const res = await client.patch(`/api/v1/accounts/${accountId}`, data);
    return res.data;
  },

  // Transaction Endpoints
  async getTransactions(page = 0, size = 50, status = null) {
    await this.ensureAuthenticated();
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append('status', status);
    const res = await client.get(`/api/v1/transactions?${params.toString()}`);
    return res.data.content || res.data;
  },

  async getTransaction(transactionId) {
    await this.ensureAuthenticated();
    const res = await client.get(`/api/v1/transactions/${transactionId}`);
    return res.data;
  },

  async createTransaction(data) {
    await this.ensureAuthenticated();
    const res = await client.post('/api/v1/transactions', data);
    return res.data;
  },

  async reverseTransaction(transactionId) {
    await this.ensureAuthenticated();
    const res = await client.post(`/api/v1/transactions/${transactionId}/reverse`);
    return res.data;
  },

  async importCsv(file) {
    await this.ensureAuthenticated();
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/api/v1/transactions/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getExportCsvUrl() {
    return `${API_BASE}/api/v1/transactions/export`;
  },

  async exportCsv() {
    await this.ensureAuthenticated();
    const res = await client.get('/api/v1/transactions/export', {
      responseType: 'blob',
    });
    return res.data;
  },

  // Reports Endpoints
  async getPnl(year = new Date().getFullYear(), month = new Date().getMonth() + 1, currency = null) {
    await this.ensureAuthenticated();
    const params = new URLSearchParams({ year: String(year), month: String(month) });
    if (currency) params.append('currency', currency);
    const res = await client.get(`/api/v1/reports/pnl?${params.toString()}`);
    return res.data;
  },

  async getBalanceSheet(asOf = null) {
    await this.ensureAuthenticated();
    const params = new URLSearchParams();
    if (asOf) params.append('asOf', asOf);
    const res = await client.get(`/api/v1/reports/balance-sheet?${params.toString()}`);
    return res.data;
  },

  async getCategorySpending(startDate = null, endDate = null, currency = null) {
    await this.ensureAuthenticated();
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (currency) params.append('currency', currency);
    const res = await client.get(`/api/v1/reports/categories?${params.toString()}`);
    return res.data;
  },
};
