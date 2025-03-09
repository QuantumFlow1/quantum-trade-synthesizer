
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

// Apply theme from localStorage before rendering
const savedTheme = localStorage.getItem('color-theme') || 'dark';
document.documentElement.classList.remove('light', 'dark');
document.documentElement.classList.add(savedTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
