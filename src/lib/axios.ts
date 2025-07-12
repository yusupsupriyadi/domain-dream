import axios from 'axios';

// Create axios instance with base configuration
export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 30000, // 30 seconds timeout
});

// Request interceptor for auth token (if needed in future)
api.interceptors.request.use(
	(config) => {
		// You can add auth token here if needed
		// const token = localStorage.getItem('token');
		// if (token) {
		//   config.headers.Authorization = `Bearer ${token}`;
		// }
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response) {
			// Server responded with error status
			console.error('API Error:', error.response.data);
		} else if (error.request) {
			// Request was made but no response
			console.error('Network Error:', error.message);
		} else {
			// Something else happened
			console.error('Error:', error.message);
		}
		return Promise.reject(error);
	}
);
