const IS_PROD = import.meta.env.MODE === 'production';
const RENDER_URL = 'https://dog-healthcare-backend.onrender.com';

export const BASE_URL = IS_PROD ? RENDER_URL : 'http://localhost:5000';
export const API_URL = IS_PROD ? `${RENDER_URL}/api` : '/api';

export default API_URL;
