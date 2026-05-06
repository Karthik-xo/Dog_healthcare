const RENDER_URL = 'https://dog-healthcare-backend.onrender.com';

// Force production URLs to avoid environment detection issues on Render
export const BASE_URL = RENDER_URL;
export const API_URL = `${RENDER_URL}/api`;

export default API_URL;
