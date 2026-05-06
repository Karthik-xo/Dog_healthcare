import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Log to help debug Render deployments
console.log('📦 Main.jsx loading...');

const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error('CRITICAL: Root element not found!');
} else {
    createRoot(rootElement).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
    console.log('✅ App rendered successfully');
}
