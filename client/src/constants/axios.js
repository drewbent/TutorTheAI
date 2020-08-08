const PROD = (process.env.NODE_ENV === 'production');

export const API_URL = (PROD
  ? 'https://tutortheai.com/api/v1/'
  : 'http://localhost:5000/api/v1/'
);