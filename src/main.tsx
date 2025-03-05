
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'
import { ThemeProvider } from './components/theme-provider'
import { BelgianComplianceProvider } from './components/trading/BelgianComplianceProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <BelgianComplianceProvider>
          <App />
        </BelgianComplianceProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
