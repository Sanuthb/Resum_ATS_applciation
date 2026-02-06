import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add interceptor to include JWT token and Content-Type in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('resume_ats_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const resumeService = {
  getResumes: () => api.get('/resumes'),
  getResume: (id) => api.get(`/resumes/${id}`),
  createResume: (data) => api.post('/resumes', data),
  updateResume: (id, data) => api.put(`/resumes/${id}`, data),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
};

export const jobService = {
  analyzeJD: (jdContent) => api.post('/jobs/analyze', { jdContent }),
  scoreResume: (resumeId, jobId) => api.post('/jobs/score', { resume_id: resumeId, job_id: jobId }),
};

export const aiService = {
  optimizeBullets: (bulletPoints, targetKeywords) => api.post('/ai/optimize', { bulletPoints, targetKeywords }),
  generateCoverLetter: (resumeContent, jdContent) => api.post('/ai/cover-letter', { resumeContent, jdContent }),
};

export const subscriptionService = {
  createCheckoutSession: () => api.post('/subscription/create-checkout-session'),
  verifySession: (sessionId) => api.get(`/subscription/verify-session?session_id=${encodeURIComponent(sessionId)}`),
  upgrade: () => api.post('/subscription/upgrade'),
};

export const pdfService = {
  generatePDF: (htmlContent) => api.post('/pdf/generate', { htmlContent }, { responseType: 'blob' }),
};

export default api;
